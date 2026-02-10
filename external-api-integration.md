# External API Integration Specification

**Version:** 1.0  
**Date:** February 9, 2026  
**Status:** Complete Integration Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Google Books API Integration](#google-books)
3. [LLM/AI API Integration](#llm-api)
4. [Email Service Integration](#email-service)
5. [Image Storage & CDN](#image-storage)
6. [Environment Configuration](#environment)
7. [Error Handling Strategy](#error-handling)
8. [Testing External APIs](#testing)
9. [Cost Management](#cost-management)
10. [Rate Limiting & Quotas](#rate-limiting)

---

<a name="overview"></a>
## 1. Overview

### External Dependencies

The Book Review App integrates with the following external services:

| Service | Purpose | Provider | Required |
|---------|---------|----------|----------|
| Book Data | Search & metadata | Google Books API | Yes |
| AI/LLM | Recommendations, search | Anthropic Claude | Yes |
| Email | Transactional emails | Resend | Yes |
| Image Storage | Avatar uploads | AWS S3 / Cloudinary | Optional |
| CDN | Static assets | Cloudflare | Optional |

### Integration Architecture

```
┌─────────────────────────────────────────────┐
│           Django Backend                    │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  API Integration Layer              │   │
│  │  - google_books_service.py          │   │
│  │  - ai_service.py                    │   │
│  │  - email_service.py                 │   │
│  │  - storage_service.py               │   │
│  └─────────────────────────────────────┘   │
│           ↓         ↓         ↓             │
└───────────┼─────────┼─────────┼─────────────┘
            │         │         │
    ┌───────┼─────────┼─────────┼────────┐
    ↓       ↓         ↓         ↓        ↓
┌────────┐ ┌────┐ ┌────────┐ ┌────┐ ┌──────┐
│ Google │ │AI  │ │ Email  │ │ S3 │ │ CDN  │
│ Books  │ │API │ │Service │ │    │ │      │
└────────┘ └────┘ └────────┘ └────┘ └──────┘
```

---

<a name="google-books"></a>
## 2. Google Books API Integration

### 2.1 Overview

**Purpose:** Fetch book metadata, search books, get cover images

**Documentation:** https://developers.google.com/books/docs/v1/using

**Pricing:** Free (1,000 requests/day per API key)

### 2.2 Setup

#### Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "BookReviewApp"
3. Enable "Books API"
4. Create credentials → API Key
5. Restrict API key:
   - API restrictions: Enable only "Books API"
   - Application restrictions: HTTP referrers (add your domains)

#### Environment Variable

```bash
# .env
GOOGLE_BOOKS_API_KEY=AIzaSyC...
```

### 2.3 Service Implementation

```python
# services/google_books_service.py

import requests
from django.conf import settings
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)

class GoogleBooksService:
    BASE_URL = "https://www.googleapis.com/books/v1/volumes"
    
    def __init__(self):
        self.api_key = settings.GOOGLE_BOOKS_API_KEY
        if not self.api_key:
            raise ValueError("GOOGLE_BOOKS_API_KEY not configured")
    
    def search_books(self, query, max_results=20, start_index=0):
        """
        Search for books by title, author, ISBN, etc.
        
        Args:
            query: Search query string
            max_results: Number of results (max 40)
            start_index: Pagination offset
            
        Returns:
            dict: Normalized book results
        """
        # Cache key
        cache_key = f"gbooks_search:{query}:{start_index}:{max_results}"
        cached = cache.get(cache_key)
        if cached:
            logger.info(f"Cache hit for query: {query}")
            return cached
        
        try:
            params = {
                'q': query,
                'maxResults': min(max_results, 40),
                'startIndex': start_index,
                'key': self.api_key,
                'printType': 'books',
                'orderBy': 'relevance'
            }
            
            response = requests.get(
                self.BASE_URL,
                params=params,
                timeout=10
            )
            response.raise_for_status()
            
            data = response.json()
            results = self._normalize_search_results(data)
            
            # Cache for 1 hour
            cache.set(cache_key, results, 3600)
            
            logger.info(f"Google Books search: {query} - {len(results)} results")
            return results
            
        except requests.RequestException as e:
            logger.error(f"Google Books API error: {str(e)}")
            return self._handle_api_error(e)
    
    def get_book_by_id(self, google_books_id):
        """
        Get detailed book information by Google Books ID
        
        Args:
            google_books_id: Google Books volume ID
            
        Returns:
            dict: Normalized book data
        """
        cache_key = f"gbooks_id:{google_books_id}"
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        try:
            url = f"{self.BASE_URL}/{google_books_id}"
            params = {'key': self.api_key}
            
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            result = self._normalize_book_data(data)
            
            # Cache for 24 hours (book data rarely changes)
            cache.set(cache_key, result, 86400)
            
            return result
            
        except requests.RequestException as e:
            logger.error(f"Google Books get_book error: {str(e)}")
            return self._handle_api_error(e)
    
    def search_by_isbn(self, isbn):
        """
        Search for a book by ISBN-10 or ISBN-13
        
        Args:
            isbn: ISBN-10 or ISBN-13
            
        Returns:
            dict: Book data or None
        """
        # Clean ISBN (remove hyphens, spaces)
        clean_isbn = isbn.replace('-', '').replace(' ', '')
        
        query = f"isbn:{clean_isbn}"
        results = self.search_books(query, max_results=1)
        
        return results[0] if results else None
    
    def _normalize_search_results(self, api_response):
        """
        Normalize Google Books API response to our schema
        
        Args:
            api_response: Raw API response
            
        Returns:
            list: Normalized book objects
        """
        items = api_response.get('items', [])
        normalized = []
        
        for item in items:
            try:
                book = self._normalize_book_data(item)
                if book:  # Only add if normalization succeeded
                    normalized.append(book)
            except Exception as e:
                logger.warning(f"Error normalizing book: {str(e)}")
                continue
        
        return normalized
    
    def _normalize_book_data(self, item):
        """
        Convert Google Books volume to our Book model format
        
        Args:
            item: Google Books volume item
            
        Returns:
            dict: Normalized book data
        """
        volume_info = item.get('volumeInfo', {})
        
        # Extract ISBNs
        isbn_10 = None
        isbn_13 = None
        for identifier in volume_info.get('industryIdentifiers', []):
            if identifier['type'] == 'ISBN_10':
                isbn_10 = identifier['identifier']
            elif identifier['type'] == 'ISBN_13':
                isbn_13 = identifier['identifier']
        
        # Extract image URLs
        image_links = volume_info.get('imageLinks', {})
        cover_url = (
            image_links.get('large') or
            image_links.get('medium') or
            image_links.get('thumbnail') or
            None
        )
        # Remove zoom parameter for better quality
        if cover_url:
            cover_url = cover_url.replace('zoom=1', 'zoom=0')
        
        thumbnail_url = image_links.get('thumbnail')
        if thumbnail_url:
            thumbnail_url = thumbnail_url.replace('zoom=1', 'zoom=0')
        
        return {
            'google_books_id': item['id'],
            'title': volume_info.get('title'),
            'authors': volume_info.get('authors', []),
            'description': volume_info.get('description'),
            'publisher': volume_info.get('publisher'),
            'published_date': volume_info.get('publishedDate'),
            'page_count': volume_info.get('pageCount'),
            'categories': volume_info.get('categories', []),
            'language': volume_info.get('language', 'en'),
            'isbn_10': isbn_10,
            'isbn_13': isbn_13,
            'cover_image_url': cover_url,
            'thumbnail_url': thumbnail_url,
            'average_rating': volume_info.get('averageRating'),
            'ratings_count': volume_info.get('ratingsCount'),
            'preview_link': volume_info.get('previewLink'),
            'info_link': volume_info.get('infoLink'),
        }
    
    def _handle_api_error(self, error):
        """
        Handle API errors gracefully
        
        Args:
            error: Exception object
            
        Returns:
            list: Empty list (safe fallback)
        """
        if isinstance(error, requests.HTTPError):
            if error.response.status_code == 429:
                logger.error("Google Books rate limit exceeded")
                # Could implement exponential backoff here
            elif error.response.status_code == 403:
                logger.error("Google Books API key invalid or quota exceeded")
        
        return []

# Singleton instance
google_books_service = GoogleBooksService()
```

### 2.4 Usage in Views

```python
# views/books.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from services.google_books_service import google_books_service
from .models import Book

@api_view(['GET'])
def search_books(request):
    """
    Search for books via Google Books API
    
    Query params:
        q: Search query
        page: Page number (default: 1)
        limit: Results per page (default: 20)
    """
    query = request.GET.get('q', '')
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 20))
    
    if not query or len(query) < 2:
        return Response({
            'error': 'Query must be at least 2 characters'
        }, status=400)
    
    start_index = (page - 1) * limit
    
    # Search Google Books
    results = google_books_service.search_books(
        query=query,
        max_results=limit,
        start_index=start_index
    )
    
    # Check which books are already in our database
    google_ids = [book['google_books_id'] for book in results]
    existing_books = Book.objects.filter(
        google_books_id__in=google_ids
    ).values_list('google_books_id', flat=True)
    
    # Mark books that are already saved
    for book in results:
        book['in_database'] = book['google_books_id'] in existing_books
    
    return Response({
        'query': query,
        'page': page,
        'results': results,
        'total': len(results)  # Google Books doesn't provide total count
    })


@api_view(['POST'])
def add_book_from_google(request):
    """
    Add a book to our database from Google Books
    
    Body:
        google_books_id: Google Books volume ID
    """
    google_books_id = request.data.get('google_books_id')
    
    if not google_books_id:
        return Response({'error': 'google_books_id required'}, status=400)
    
    # Check if book already exists
    book = Book.objects.filter(google_books_id=google_books_id).first()
    if book:
        return Response({
            'message': 'Book already exists',
            'book': BookSerializer(book).data
        })
    
    # Fetch from Google Books
    book_data = google_books_service.get_book_by_id(google_books_id)
    
    if not book_data:
        return Response({
            'error': 'Book not found in Google Books'
        }, status=404)
    
    # Create book in our database
    book = Book.objects.create(**book_data)
    
    return Response({
        'message': 'Book added successfully',
        'book': BookSerializer(book).data
    }, status=201)
```

### 2.5 Rate Limiting Strategy

**Google Books Limits:**
- 1,000 requests per day (free tier)
- No per-second limit documented

**Our Strategy:**

1. **Aggressive Caching**
   - Search results: 1 hour
   - Book details: 24 hours
   - ISBN lookups: 24 hours

2. **Database First**
   - Always check local database before calling API
   - Only fetch new books or missing data

3. **Batch Requests**
   - Pre-populate database with popular books
   - Import book lists during off-peak hours

4. **Monitoring**
   - Log all API calls
   - Track daily quota usage
   - Alert at 80% quota

### 2.6 Error Handling

```python
# Graceful fallback strategies

def search_books_with_fallback(query):
    """
    Search with fallback to database-only search if API fails
    """
    try:
        # Try Google Books first
        results = google_books_service.search_books(query)
        return results
    except Exception as e:
        logger.error(f"Google Books API failed, falling back to DB: {e}")
        
        # Fallback: Search our database only
        books = Book.objects.filter(
            Q(title__icontains=query) | 
            Q(authors__icontains=query)
        )[:20]
        
        return [book.to_dict() for book in books]
```

### 2.7 Testing

```python
# tests/test_google_books_service.py

import pytest
from unittest.mock import patch, Mock
from services.google_books_service import GoogleBooksService

@pytest.fixture
def mock_google_response():
    return {
        'items': [{
            'id': 'test123',
            'volumeInfo': {
                'title': 'Test Book',
                'authors': ['Test Author'],
                'description': 'A test book',
                'pageCount': 300,
                'categories': ['Fiction'],
                'imageLinks': {
                    'thumbnail': 'http://example.com/cover.jpg'
                }
            }
        }]
    }

@patch('requests.get')
def test_search_books(mock_get, mock_google_response):
    mock_get.return_value.json.return_value = mock_google_response
    mock_get.return_value.raise_for_status = Mock()
    
    service = GoogleBooksService()
    results = service.search_books('test query')
    
    assert len(results) == 1
    assert results[0]['title'] == 'Test Book'
    assert results[0]['google_books_id'] == 'test123'

@patch('requests.get')
def test_api_error_handling(mock_get):
    mock_get.side_effect = requests.RequestException("API Error")
    
    service = GoogleBooksService()
    results = service.search_books('test')
    
    # Should return empty list, not raise exception
    assert results == []
```

---

<a name="llm-api"></a>
## 3. LLM/AI API Integration

### 3.1 Provider Selection: **Anthropic Claude**

**Why Claude:**
- Superior reasoning for book recommendations
- Long context window (200K tokens) for analyzing reading history
- Function calling for structured outputs
- Competitive pricing
- Better at nuanced, subjective tasks like book matching

**Alternative:** OpenAI GPT-4 (fallback option)

### 3.2 Setup

#### Get API Key

1. Sign up at https://console.anthropic.com
2. Generate API key
3. Set spending limits (recommended: $50/month for development)

#### Environment Variable

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
```

### 3.3 Installation

```bash
pip install anthropic
```

### 3.4 Service Implementation

```python
# services/ai_service.py

import anthropic
from django.conf import settings
from django.core.cache import cache
import json
import logging

logger = logging.getLogger(__name__)

class AIService:
    """
    AI-powered features using Anthropic Claude
    """
    
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=settings.ANTHROPIC_API_KEY
        )
        self.model = settings.ANTHROPIC_MODEL
    
    def search_book_by_description(self, description, user_context=None):
        """
        AI-powered book search from vague descriptions
        
        Args:
            description: User's description of the book
            user_context: Optional dict with genre, era, etc.
            
        Returns:
            list: Book suggestions with match scores and reasons
        """
        # Build prompt
        prompt = self._build_search_prompt(description, user_context)
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1500,
                temperature=0.3,  # Lower for more consistent results
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            # Parse AI response
            content = response.content[0].text
            results = self._parse_search_results(content)
            
            logger.info(f"AI search completed: {len(results)} suggestions")
            return results
            
        except Exception as e:
            logger.error(f"AI search error: {str(e)}")
            return []
    
    def generate_personalized_recommendations(
        self, 
        user_id, 
        reading_history, 
        preferences,
        count=10
    ):
        """
        Generate personalized book recommendations
        
        Args:
            user_id: User ID (for caching)
            reading_history: List of books user has read with ratings
            preferences: User preferences (genres, themes, etc.)
            count: Number of recommendations
            
        Returns:
            list: Recommended books with match scores and reasons
        """
        # Check cache first (recommendations valid for 24 hours)
        cache_key = f"ai_recs:{user_id}:{hash(str(reading_history))}"
        cached = cache.get(cache_key)
        if cached:
            return cached
        
        prompt = self._build_recommendation_prompt(
            reading_history, 
            preferences, 
            count
        )
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2000,
                temperature=0.5,  # Higher for more diverse recommendations
                messages=[{
                    "role": "user",
                    "content": prompt
                }]
            )
            
            content = response.content[0].text
            recommendations = self._parse_recommendations(content)
            
            # Cache for 24 hours
            cache.set(cache_key, recommendations, 86400)
            
            logger.info(f"Generated {len(recommendations)} recommendations for user {user_id}")
            return recommendations
            
        except Exception as e:
            logger.error(f"AI recommendation error: {str(e)}")
            return []
    
    def create_ai_feed(self, feed_criteria):
        """
        Create an AI-powered recommendation feed
        
        Args:
            feed_criteria: Natural language description of desired books
            
        Returns:
            dict: Feed configuration with book suggestions
        """
        prompt = f"""Create a book recommendation feed based on these criteria:

{feed_criteria}

Please provide:
1. A catchy name for this feed (max 50 characters)
2. A brief description (max 200 characters)
3. 10 book recommendations that match these criteria
4. For each book, explain why it matches (2-3 sentences)

Format your response as JSON:
{{
  "name": "Feed Name",
  "description": "Feed description",
  "books": [
    {{
      "title": "Book Title",
      "author": "Author Name",
      "match_reason": "Why this book matches...",
      "match_score": 0.95
    }}
  ]
}}"""
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2500,
                temperature=0.4,
                messages=[{"role": "user", "content": prompt}]
            )
            
            content = response.content[0].text
            # Extract JSON from response
            feed_data = self._extract_json(content)
            
            return feed_data
            
        except Exception as e:
            logger.error(f"AI feed creation error: {str(e)}")
            return None
    
    def summarize_reviews(self, reviews, max_length=200):
        """
        Summarize multiple reviews into key themes
        
        Args:
            reviews: List of review texts
            max_length: Max summary length
            
        Returns:
            str: Summary of reviews
        """
        if not reviews:
            return "No reviews available."
        
        # Sample if too many reviews
        if len(reviews) > 20:
            import random
            reviews = random.sample(reviews, 20)
        
        reviews_text = "\n\n".join([
            f"Review {i+1}: {review}" 
            for i, review in enumerate(reviews)
        ])
        
        prompt = f"""Summarize the key themes and opinions from these book reviews in {max_length} characters or less:

{reviews_text}

Focus on:
- Common praise
- Common criticisms
- Overall sentiment
- Who would enjoy this book

Provide a concise, balanced summary."""
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=300,
                temperature=0.3,
                messages=[{"role": "user", "content": prompt}]
            )
            
            summary = response.content[0].text.strip()
            return summary
            
        except Exception as e:
            logger.error(f"Review summarization error: {str(e)}")
            return "Unable to generate summary."
    
    def _build_search_prompt(self, description, context):
        """Build prompt for book search"""
        prompt = f"""You are a book recommendation expert. A user is trying to find a book based on this description:

"{description}"
"""
        
        if context:
            prompt += f"\nAdditional context:\n"
            if context.get('genre'):
                prompt += f"- Genre preference: {context['genre']}\n"
            if context.get('era'):
                prompt += f"- Time period: {context['era']}\n"
            if context.get('read_when'):
                prompt += f"- When they read it: {context['read_when']}\n"
        
        prompt += """
Please suggest up to 5 books that match this description. For each book, provide:
1. Title
2. Author
3. Why it matches (be specific about which details match)
4. Confidence score (0.0-1.0)

Format as JSON:
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "match_reasons": ["Reason 1", "Reason 2"],
    "confidence": 0.95
  }
]

Order by confidence (highest first).
"""
        return prompt
    
    def _build_recommendation_prompt(self, reading_history, preferences, count):
        """Build prompt for personalized recommendations"""
        
        # Format reading history
        history_text = "Books they've read and enjoyed:\n"
        for book in reading_history[:20]:  # Limit to recent 20
            history_text += f"- {book['title']} by {book['author']} (rated {book['rating']}/5)\n"
        
        # Format preferences
        pref_text = "\nPreferences:\n"
        if preferences.get('favorite_genres'):
            pref_text += f"- Favorite genres: {', '.join(preferences['favorite_genres'])}\n"
        if preferences.get('themes'):
            pref_text += f"- Preferred themes: {', '.join(preferences['themes'])}\n"
        
        prompt = f"""You are a personalized book recommendation AI. Based on this reader's profile, suggest {count} books they would love.

{history_text}
{pref_text}

Please recommend {count} books that:
1. Match their taste based on their reading history
2. Offer variety (don't just recommend similar books)
3. Include both popular and hidden gem options

For each recommendation, provide:
- Title and author
- Why it matches their taste (2-3 specific reasons)
- Match score (0.0-1.0)
- Key themes

Format as JSON:
[
  {{
    "title": "Book Title",
    "author": "Author Name",
    "match_reasons": ["Reason 1", "Reason 2"],
    "match_score": 0.92,
    "themes": ["Theme 1", "Theme 2"]
  }}
]
"""
        return prompt
    
    def _parse_search_results(self, ai_response):
        """Parse AI response for search results"""
        try:
            # Extract JSON from response
            results = self._extract_json(ai_response)
            return results if isinstance(results, list) else []
        except Exception as e:
            logger.error(f"Error parsing AI search results: {e}")
            return []
    
    def _parse_recommendations(self, ai_response):
        """Parse AI response for recommendations"""
        try:
            results = self._extract_json(ai_response)
            return results if isinstance(results, list) else []
        except Exception as e:
            logger.error(f"Error parsing AI recommendations: {e}")
            return []
    
    def _extract_json(self, text):
        """Extract JSON from AI response (may include markdown)"""
        # Remove markdown code blocks if present
        text = text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        
        text = text.strip()
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.error(f"JSON parsing error: {e}")
            # Try to find JSON in the text
            import re
            json_match = re.search(r'\[.*\]|\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
            return None

# Singleton instance
ai_service = AIService()
```

### 3.5 Usage in Views

```python
# views/ai.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from services.ai_service import ai_service
from .models import UserBook, Book

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_book_search(request):
    """
    AI-powered book search from description
    
    Body:
        description: User's description of the book
        genre: Optional genre filter
        era: Optional time period
    """
    description = request.data.get('description', '')
    
    if len(description) < 20:
        return Response({
            'error': 'Description must be at least 20 characters'
        }, status=400)
    
    context = {
        'genre': request.data.get('genre'),
        'era': request.data.get('era'),
        'read_when': request.data.get('read_when')
    }
    
    # Call AI service
    suggestions = ai_service.search_book_by_description(
        description, 
        context
    )
    
    # Try to find these books in our database or Google Books
    enriched_suggestions = []
    for suggestion in suggestions:
        # Search our DB first
        book = Book.objects.filter(
            title__icontains=suggestion['title'],
            authors__icontains=suggestion['author']
        ).first()
        
        if book:
            suggestion['book_id'] = book.id
            suggestion['in_database'] = True
        else:
            # Could optionally search Google Books here
            suggestion['in_database'] = False
        
        enriched_suggestions.append(suggestion)
    
    return Response({
        'query': description,
        'suggestions': enriched_suggestions
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def personalized_recommendations(request):
    """
    Get AI-generated personalized recommendations
    """
    user = request.user
    
    # Get user's reading history
    user_books = UserBook.objects.filter(
        user=user,
        shelf_status='finished'
    ).select_related('book').order_by('-finish_date')[:50]
    
    reading_history = [
        {
            'title': ub.book.title,
            'author': ', '.join(ub.book.authors),
            'rating': ub.rating if hasattr(ub, 'rating') else None
        }
        for ub in user_books
    ]
    
    # Get user preferences (could be from profile)
    preferences = {
        'favorite_genres': ['Fantasy', 'Science Fiction'],  # From user data
        'themes': ['Epic', 'Character-driven']
    }
    
    # Generate recommendations
    recommendations = ai_service.generate_personalized_recommendations(
        user_id=user.id,
        reading_history=reading_history,
        preferences=preferences,
        count=10
    )
    
    return Response({
        'recommendations': recommendations
    })
```

### 3.6 Cost Management

**Anthropic Claude Pricing (as of 2024):**
- Claude Sonnet: $3 per million input tokens, $15 per million output tokens
- Claude Haiku (faster/cheaper): $0.25 in, $1.25 out

**Estimated Monthly Costs:**

| Feature | Tokens/Request | Requests/Day | Monthly Cost |
|---------|----------------|--------------|--------------|
| AI Search | ~500 in, 300 out | 100 | $4.50 |
| Recommendations | ~1000 in, 500 out | 50 | $3.75 |
| Review Summary | ~800 in, 200 out | 30 | $1.80 |
| AI Feeds | ~600 in, 1000 out | 20 | $4.80 |
| **Total** | | | **~$15/month** |

**Cost Optimization Strategies:**

1. **Aggressive Caching**
   - Cache recommendations for 24 hours
   - Cache AI searches for similar queries
   - Cache review summaries

2. **Model Selection**
   - Use Haiku for simple tasks (search, summarization)
   - Use Sonnet for complex recommendations

3. **Rate Limiting**
   - Limit AI features to authenticated users
   - Max 10 AI searches per user per day
   - Max 5 recommendation refreshes per week

4. **Batch Processing**
   - Generate AI feeds in background jobs
   - Pre-compute recommendations for active users

### 3.7 Testing

```python
# tests/test_ai_service.py

import pytest
from unittest.mock import patch, Mock
from services.ai_service import AIService

@pytest.fixture
def mock_ai_response():
    return Mock(
        content=[Mock(
            text='[{"title": "Test Book", "author": "Test Author", "confidence": 0.95}]'
        )]
    )

@patch('anthropic.Anthropic')
def test_ai_book_search(mock_anthropic, mock_ai_response):
    mock_client = Mock()
    mock_client.messages.create.return_value = mock_ai_response
    mock_anthropic.return_value = mock_client
    
    service = AIService()
    results = service.search_book_by_description("A book about wizards")
    
    assert len(results) == 1
    assert results[0]['title'] == 'Test Book'
    assert results[0]['confidence'] == 0.95
```

---

<a name="email-service"></a>
## 4. Email Service Integration

### 4.1 Provider Selection: **Resend**

**Why Resend:**
- Modern, developer-friendly API
- Generous free tier (3,000 emails/month)
- Easy React Email integration
- Good deliverability
- Simple pricing

**Alternatives:**
- SendGrid (more features, complex pricing)
- AWS SES (cheapest, but requires more setup)
- Postmark (good for transactional, more expensive)

### 4.2 Setup

#### Sign Up & Get API Key

1. Sign up at https://resend.com
2. Verify your domain (or use resend.dev for testing)
3. Generate API key

#### Environment Variables

```bash
# .env
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=BookReview App
```

### 4.3 Installation

```bash
pip install resend
```

### 4.4 Service Implementation

```python
# services/email_service.py

import resend
from django.conf import settings
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)

resend.api_key = settings.RESEND_API_KEY

class EmailService:
    """
    Email service using Resend
    """
    
    FROM_EMAIL = settings.RESEND_FROM_EMAIL
    FROM_NAME = settings.RESEND_FROM_NAME
    
    def send_verification_email(self, user, verification_token):
        """
        Send email verification link
        
        Args:
            user: User object
            verification_token: Verification token
        """
        verification_url = (
            f"{settings.FRONTEND_URL}/verify-email?"
            f"token={verification_token}"
        )
        
        html_content = render_to_string(
            'emails/verify_email.html',
            {
                'user': user,
                'verification_url': verification_url
            }
        )
        
        try:
            params = {
                "from": f"{self.FROM_NAME} <{self.FROM_EMAIL}>",
                "to": [user.email],
                "subject": "Verify your email address",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Verification email sent to {user.email}")
            return response
            
        except Exception as e:
            logger.error(f"Error sending verification email: {e}")
            raise
    
    def send_password_reset_email(self, user, reset_token):
        """
        Send password reset link
        
        Args:
            user: User object
            reset_token: Password reset token
        """
        reset_url = (
            f"{settings.FRONTEND_URL}/reset-password?"
            f"token={reset_token}"
        )
        
        html_content = render_to_string(
            'emails/password_reset.html',
            {
                'user': user,
                'reset_url': reset_url
            }
        )
        
        try:
            params = {
                "from": f"{self.FROM_NAME} <{self.FROM_EMAIL}>",
                "to": [user.email],
                "subject": "Reset your password",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Password reset email sent to {user.email}")
            return response
            
        except Exception as e:
            logger.error(f"Error sending password reset email: {e}")
            raise
    
    def send_notification_email(self, user, notification_type, context):
        """
        Send notification emails based on user preferences
        
        Args:
            user: User object
            notification_type: Type of notification
            context: Email context data
        """
        # Check user preferences
        prefs = user.notification_preferences
        
        email_prefs_map = {
            'new_follower': prefs.email_new_follower,
            'review_comment': prefs.email_review_comment,
            'comment_reply': prefs.email_comment_reply,
            'chat_mention': prefs.email_chat_mention,
        }
        
        if not email_prefs_map.get(notification_type, False):
            logger.info(f"Email notifications disabled for {notification_type}")
            return
        
        # Map notification types to templates
        template_map = {
            'new_follower': 'emails/new_follower.html',
            'review_comment': 'emails/review_comment.html',
            'comment_reply': 'emails/comment_reply.html',
            'chat_mention': 'emails/chat_mention.html',
        }
        
        subject_map = {
            'new_follower': 'You have a new follower',
            'review_comment': 'New comment on your review',
            'comment_reply': 'Someone replied to your comment',
            'chat_mention': 'You were mentioned in a chat',
        }
        
        template = template_map.get(notification_type)
        subject = subject_map.get(notification_type, 'New notification')
        
        if not template:
            logger.warning(f"No template for notification type: {notification_type}")
            return
        
        html_content = render_to_string(template, {
            'user': user,
            **context
        })
        
        try:
            params = {
                "from": f"{self.FROM_NAME} <{self.FROM_EMAIL}>",
                "to": [user.email],
                "subject": subject,
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Notification email sent: {notification_type} to {user.email}")
            return response
            
        except Exception as e:
            logger.error(f"Error sending notification email: {e}")
            # Don't raise - notification emails are not critical
    
    def send_weekly_summary(self, user, summary_data):
        """
        Send weekly reading summary email
        
        Args:
            user: User object
            summary_data: Dict with weekly stats
        """
        prefs = user.notification_preferences
        
        if not prefs.email_weekly_summary:
            return
        
        html_content = render_to_string(
            'emails/weekly_summary.html',
            {
                'user': user,
                'books_read': summary_data.get('books_read', 0),
                'pages_read': summary_data.get('pages_read', 0),
                'reviews_written': summary_data.get('reviews_written', 0),
                'new_followers': summary_data.get('new_followers', 0),
                'recommended_books': summary_data.get('recommended_books', []),
            }
        )
        
        try:
            params = {
                "from": f"{self.FROM_NAME} <{self.FROM_EMAIL}>",
                "to": [user.email],
                "subject": f"Your weekly reading summary - {summary_data.get('week_range')}",
                "html": html_content,
            }
            
            response = resend.Emails.send(params)
            logger.info(f"Weekly summary sent to {user.email}")
            return response
            
        except Exception as e:
            logger.error(f"Error sending weekly summary: {e}")

# Singleton instance
email_service = EmailService()
```

### 4.5 Email Templates

```html
<!-- templates/emails/verify_email.html -->

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #2563EB;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <h1>Welcome to BookReview App! 📚</h1>
    
    <p>Hi {{ user.first_name or user.username }},</p>
    
    <p>Thanks for signing up! Please verify your email address to get started.</p>
    
    <a href="{{ verification_url }}" class="button">Verify Email Address</a>
    
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #2563EB;">{{ verification_url }}</p>
    
    <p>This link will expire in 24 hours.</p>
    
    <div class="footer">
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>© 2026 BookReview App. All rights reserved.</p>
    </div>
</body>
</html>
```

```html
<!-- templates/emails/password_reset.html -->

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        /* Same styles as above */
    </style>
</head>
<body>
    <h1>Reset Your Password</h1>
    
    <p>Hi {{ user.username }},</p>
    
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    
    <a href="{{ reset_url }}" class="button">Reset Password</a>
    
    <p>Or copy and paste this link:</p>
    <p style="word-break: break-all; color: #2563EB;">{{ reset_url }}</p>
    
    <p>This link will expire in 1 hour.</p>
    
    <div class="footer">
        <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
        <p>© 2026 BookReview App</p>
    </div>
</body>
</html>
```

### 4.6 Background Email Jobs

```python
# tasks.py (Celery tasks)

from celery import shared_task
from .models import User
from services.email_service import email_service
from datetime import datetime, timedelta

@shared_task
def send_weekly_summaries():
    """
    Send weekly reading summaries to all users
    Run every Monday at 9 AM
    """
    users = User.objects.filter(
        is_active=True,
        notificationpreferences__email_weekly_summary=True
    )
    
    for user in users:
        # Calculate weekly stats
        week_ago = datetime.now() - timedelta(days=7)
        
        summary_data = {
            'books_read': user.userbook_set.filter(
                finish_date__gte=week_ago
            ).count(),
            'pages_read': calculate_pages_read(user, week_ago),
            'reviews_written': user.review_set.filter(
                created_at__gte=week_ago
            ).count(),
            'new_followers': user.followers.filter(
                created_at__gte=week_ago
            ).count(),
            'week_range': f"{week_ago.strftime('%b %d')} - {datetime.now().strftime('%b %d')}",
        }
        
        # Send email
        try:
            email_service.send_weekly_summary(user, summary_data)
        except Exception as e:
            logger.error(f"Failed to send weekly summary to {user.id}: {e}")
```

---

<a name="image-storage"></a>
## 5. Image Storage & CDN

### 5.1 Provider Selection: **AWS S3 + CloudFront**

**For Development:** Local storage or cloud storage

**For Production:** AWS S3 with CloudFront CDN

### 5.2 Setup (Optional for MVP)

```bash
# .env
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_STORAGE_BUCKET_NAME=bookreview-uploads
AWS_S3_REGION_NAME=us-east-1
AWS_S3_CUSTOM_DOMAIN=cdn.yourdomain.com  # CloudFront
```

### 5.3 Django Storage Configuration

```python
# settings.py

# Development: use local storage
if DEBUG:
    MEDIA_URL = '/media/'
    MEDIA_ROOT = BASE_DIR / 'media'
# Production: use S3
else:
    AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = env('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = env('AWS_S3_REGION_NAME')
    AWS_S3_CUSTOM_DOMAIN = env('AWS_S3_CUSTOM_DOMAIN')
    
    AWS_S3_OBJECT_PARAMETERS = {
        'CacheControl': 'max-age=86400',  # 1 day
    }
    
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/'
```

### 5.4 Avatar Upload

```python
# models.py

from django.db import models
from PIL import Image
import io

def user_avatar_path(instance, filename):
    """Generate upload path for user avatars"""
    ext = filename.split('.')[-1]
    return f'avatars/{instance.user.id}.{ext}'

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(
        upload_to=user_avatar_path,
        null=True,
        blank=True,
        max_length=500
    )
    
    def save(self, *args, **kwargs):
        # Resize avatar before saving
        if self.avatar:
            self.avatar = self._resize_avatar(self.avatar)
        super().save(*args, **kwargs)
    
    def _resize_avatar(self, image_field, size=(200, 200)):
        """Resize avatar to max size"""
        img = Image.open(image_field)
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize maintaining aspect ratio
        img.thumbnail(size, Image.Resampling.LANCZOS)
        
        # Save to BytesIO
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=85)
        output.seek(0)
        
        # Update file
        image_field.file = output
        return image_field
```

---

<a name="environment"></a>
## 6. Environment Configuration

### 6.1 Environment Variables

```bash
# .env.example

# Django
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=mysql://user:password@localhost:3306/bookreview

# External APIs
GOOGLE_BOOKS_API_KEY=AIzaSyC...
ANTHROPIC_API_KEY=sk-ant-api03-...
ANTHROPIC_MODEL=claude-sonnet-4-20250514
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=BookReview App

# AWS (Production only)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
AWS_S3_REGION_NAME=us-east-1
AWS_S3_CUSTOM_DOMAIN=

# Redis
REDIS_URL=redis://localhost:6379/0

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Security
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 6.2 Loading Environment Variables

```python
# settings.py

import os
from pathlib import Path
import environ

# Initialize environment
env = environ.Env(
    DEBUG=(bool, False)
)

BASE_DIR = Path(__file__).resolve().parent.parent

# Read .env file
environ.Env.read_env(BASE_DIR / '.env')

# External API Configuration
GOOGLE_BOOKS_API_KEY = env('GOOGLE_BOOKS_API_KEY', default='')
ANTHROPIC_API_KEY = env('ANTHROPIC_API_KEY', default='')
ANTHROPIC_MODEL = env('ANTHROPIC_MODEL', default='claude-sonnet-4-20250514')
RESEND_API_KEY = env('RESEND_API_KEY', default='')
RESEND_FROM_EMAIL = env('RESEND_FROM_EMAIL', default='noreply@example.com')
RESEND_FROM_NAME = env('RESEND_FROM_NAME', default='BookReview App')
FRONTEND_URL = env('FRONTEND_URL', default='http://localhost:5173')
```

---

<a name="error-handling"></a>
## 7. Error Handling Strategy

### 7.1 Graceful Degradation

```python
# Common error handling pattern for all external APIs

class ExternalAPIError(Exception):
    """Base exception for external API errors"""
    pass

class GoogleBooksError(ExternalAPIError):
    pass

class AIServiceError(ExternalAPIError):
    pass

class EmailServiceError(ExternalAPIError):
    pass


def with_fallback(fallback_value=None):
    """
    Decorator for graceful error handling with fallback
    """
    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except ExternalAPIError as e:
                logger.error(f"External API error in {func.__name__}: {e}")
                return fallback_value
            except Exception as e:
                logger.error(f"Unexpected error in {func.__name__}: {e}")
                return fallback_value
        return wrapper
    return decorator


# Usage
@with_fallback(fallback_value=[])
def search_books(query):
    return google_books_service.search_books(query)
```

### 7.2 Circuit Breaker Pattern

```python
# For preventing cascading failures

from datetime import datetime, timedelta

class CircuitBreaker:
    """
    Simple circuit breaker to prevent overwhelming failed services
    """
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failures = 0
        self.last_failure_time = None
        self.state = 'closed'  # closed, open, half-open
    
    def call(self, func, *args, **kwargs):
        if self.state == 'open':
            if self._should_attempt_reset():
                self.state = 'half-open'
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
    
    def _on_success(self):
        self.failures = 0
        self.state = 'closed'
    
    def _on_failure(self):
        self.failures += 1
        self.last_failure_time = datetime.now()
        
        if self.failures >= self.failure_threshold:
            self.state = 'open'
    
    def _should_attempt_reset(self):
        return (
            self.last_failure_time and
            datetime.now() - self.last_failure_time > timedelta(seconds=self.timeout)
        )

# Usage
google_books_breaker = CircuitBreaker(failure_threshold=5, timeout=60)

def search_with_breaker(query):
    return google_books_breaker.call(
        google_books_service.search_books,
        query
    )
```

---

<a name="testing"></a>
## 8. Testing External APIs

### 8.1 Mocking External APIs

```python
# conftest.py (pytest fixtures)

import pytest
from unittest.mock import Mock, patch

@pytest.fixture
def mock_google_books():
    """Mock Google Books API responses"""
    with patch('services.google_books_service.requests.get') as mock:
        mock.return_value.json.return_value = {
            'items': [{
                'id': 'test123',
                'volumeInfo': {
                    'title': 'Test Book',
                    'authors': ['Test Author']
                }
            }]
        }
        yield mock

@pytest.fixture
def mock_anthropic():
    """Mock Anthropic AI responses"""
    with patch('services.ai_service.anthropic.Anthropic') as mock:
        mock_client = Mock()
        mock_client.messages.create.return_value = Mock(
            content=[Mock(text='{"recommendations": []}')]
        )
        mock.return_value = mock_client
        yield mock

@pytest.fixture
def mock_resend():
    """Mock Resend email service"""
    with patch('services.email_service.resend.Emails.send') as mock:
        mock.return_value = {'id': 'test-email-id'}
        yield mock
```

### 8.2 Integration Tests (Optional)

```python
# tests/integration/test_google_books.py

import pytest
from services.google_books_service import GoogleBooksService

@pytest.mark.integration
@pytest.mark.skipif(
    not os.getenv('GOOGLE_BOOKS_API_KEY'),
    reason="API key not available"
)
def test_real_google_books_search():
    """
    Test actual Google Books API (only run when API key available)
    """
    service = GoogleBooksService()
    results = service.search_books('Harry Potter')
    
    assert len(results) > 0
    assert 'Harry Potter' in results[0]['title']
```

---

<a name="cost-management"></a>
## 9. Cost Management

### 9.1 Monthly Cost Estimates

| Service | Free Tier | Estimated Usage | Monthly Cost |
|---------|-----------|-----------------|--------------|
| Google Books API | 1,000 req/day | ~500/day | **$0** |
| Anthropic Claude | N/A | 200 req/day | **$15** |
| Resend Email | 3,000/month | ~1,000/month | **$0** |
| AWS S3 | 5GB storage | 2GB | **$0** |
| **TOTAL** | | | **~$15/month** |

### 9.2 Monitoring & Alerts

```python
# utils/api_usage_tracker.py

from django.core.cache import cache
from datetime import datetime

class APIUsageTracker:
    """Track API usage to prevent quota overruns"""
    
    @staticmethod
    def track_call(service_name):
        """Track an API call"""
        today = datetime.now().strftime('%Y-%m-%d')
        key = f"api_usage:{service_name}:{today}"
        
        count = cache.get(key, 0)
        cache.set(key, count + 1, 86400)  # 24 hours
        
        return count + 1
    
    @staticmethod
    def get_usage(service_name, date=None):
        """Get API usage for a service"""
        if not date:
            date = datetime.now().strftime('%Y-%m-%d')
        
        key = f"api_usage:{service_name}:{date}"
        return cache.get(key, 0)
    
    @staticmethod
    def check_quota(service_name, limit):
        """Check if quota would be exceeded"""
        usage = APIUsageTracker.get_usage(service_name)
        return usage < limit
```

---

<a name="rate-limiting"></a>
## 10. Rate Limiting & Quotas

### 10.1 Service Quotas

```python
# settings.py

API_QUOTAS = {
    'google_books': {
        'daily_limit': 900,  # Leave buffer below 1000
        'per_user_hourly': 50,
    },
    'ai_service': {
        'per_user_daily': 10,
        'per_user_monthly': 200,
    },
    'email_service': {
        'monthly_limit': 2800,  # Leave buffer below 3000
    }
}
```

### 10.2 Rate Limiting Middleware

```python
# middleware/rate_limit.py

from django.core.cache import cache
from rest_framework.exceptions import Throttled

class APIRateLimitMiddleware:
    """
    Rate limit external API usage per user
    """
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        if request.user.is_authenticated:
            self.check_ai_quota(request.user)
        
        response = self.get_response(request)
        return response
    
    def check_ai_quota(self, user):
        """Check if user has exceeded AI API quota"""
        daily_key = f"ai_quota:{user.id}:{datetime.now().strftime('%Y-%m-%d')}"
        daily_usage = cache.get(daily_key, 0)
        
        if daily_usage >= 10:
            raise Throttled(detail="Daily AI quota exceeded. Try again tomorrow.")
```

---

## Summary

This external API integration specification provides:

✅ **Google Books API** - Complete implementation with caching, error handling  
✅ **Anthropic Claude AI** - Search, recommendations, summaries with cost optimization  
✅ **Resend Email** - Transactional emails with templates  
✅ **AWS S3** - Image storage (optional)  
✅ **Environment Configuration** - Secure API key management  
✅ **Error Handling** - Graceful degradation, circuit breakers  
✅ **Testing Strategy** - Mocking, integration tests  
✅ **Cost Management** - Monitoring, quotas, alerts  
✅ **Rate Limiting** - Per-service and per-user quotas  

**Estimated Monthly Cost:** ~$15 (AI only, others free tier)

Ready for implementation!

---

**Document Version:** 1.0  
**Last Updated:** February 9, 2026  
**Status:** Complete & Production-Ready
