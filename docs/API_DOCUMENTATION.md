# ItsAThneed API Documentation

## Overview

This API provides access to thought leadership content, products, and company information. It's built on Cloudflare Workers using Hono framework and connects to a Neon PostgreSQL database.

**Base URL:** Your deployed Cloudflare Worker URL (e.g., `https://itsathneed-website-api.your-account.workers.dev`)

## Authentication

Currently, the API does not require authentication for read operations. Write operations (POST, PUT, DELETE) are available but should be secured in production.

## CORS Configuration

The API includes CORS headers to allow cross-origin requests from approved domains. Currently allowed origins:
- `https://itsathneed.com`
- `https://www.itsathneed.com`
- `https://itsathneed-showcase-website.pages.dev`

**Note:** To enable access from `https://supergrover.ai`, you'll need to add it to the allowed origins list (see implementation notes below).

## Common Headers

All requests should include:
```
Content-Type: application/json
```

## Endpoints

### Health Check

#### GET /
Check if the API is running.

**Response:**
```json
{
  "message": "ItsAThneed API is running!"
}
```

---

## Thought Leadership Endpoints

### Get All Thought Leadership

#### GET /api/thought-leadership

Returns all thought leadership items.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Article Title",
    "shortDescription": "Brief description of the article",
    "hashtags": ["ai", "innovation"],
    "imageUrl": "https://example.com/image.jpg",
    "articleUrl": "https://example.com/article",
    "featured": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Get Featured Thought Leadership

#### GET /api/thought-leadership/featured

Returns only featured thought leadership items.

**Response:** Same format as "Get All" but filtered for featured items.

### Search Thought Leadership

#### GET /api/thought-leadership/search

Search thought leadership by query or filter by hashtag.

**Query Parameters:**
- `q` (optional): Search query string
- `hashtag` (optional): Filter by hashtag

**Examples:**
- `/api/thought-leadership/search?q=artificial%20intelligence`
- `/api/thought-leadership/search?hashtag=ai`

**Response:** Array of matching thought leadership items.

#### GET /api/thought-leadership/search/:query

Alternative search endpoint using path parameter.

**Query Parameters:**
- `hashtag` (optional): Filter by hashtag

**Example:**
- `/api/thought-leadership/search/artificial%20intelligence`

### Get Thought Leadership by ID

#### GET /api/thought-leadership/:id

Get a specific thought leadership item by its ID.

**Response:**
```json
{
  "id": "uuid",
  "title": "Article Title",
  "shortDescription": "Brief description",
  "hashtags": ["ai"],
  "imageUrl": "https://example.com/image.jpg",
  "articleUrl": "https://example.com/article",
  "featured": false,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (404):**
```json
{
  "error": "Thought leadership item not found"
}
```

### Create Thought Leadership

#### POST /api/thought-leadership

Create a new thought leadership item.

**Request Body:**
```json
{
  "title": "Article Title",
  "shortDescription": "Brief description",
  "hashtags": ["ai", "innovation"],
  "imageUrl": "https://example.com/image.jpg",
  "articleUrl": "https://example.com/article",
  "featured": false
}
```

**Response (201):** Returns the created item with generated ID and timestamps.

### Update Thought Leadership

#### PUT /api/thought-leadership/:id

Update an existing thought leadership item. All fields are optional.

**Request Body:**
```json
{
  "title": "Updated Title",
  "featured": true
}
```

**Response:** Returns the updated item.

### Delete Thought Leadership

#### DELETE /api/thought-leadership/:id

Delete a thought leadership item.

**Response:** 204 No Content

---

## Product Endpoints

### Get All Products

#### GET /api/products

Returns all products.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Product Name",
    "shortDescription": "Brief description",
    "detailedDescription": "Detailed description",
    "imageUrl": "https://example.com/image.jpg",
    "status": "Research Phase",
    "statusTags": ["Open Source"],
    "technologies": ["React", "TypeScript"],
    "orderIndex": 0,
    "slug": "product-name",
    "heroImages": ["https://example.com/hero1.jpg"],
    "superpowers": "[{\"title\":\"Fast\",\"description\":\"Very fast\"}]",
    "painPointsAddressed": "[{\"title\":\"Slow\",\"description\":\"Fixes slowness\"}]",
    "keyDesignConsiderations": "[{\"title\":\"Performance\",\"description\":\"Optimized\"}]",
    "quickStartSteps": ["Install dependencies", "Run setup"],
    "githubUrl": "https://github.com/user/repo",
    "downloadUrl": "https://example.com/download",
    "demoUrl": "https://demo.example.com",
    "fullDescription": "{}",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Field Notes:**
- `status`: One of "Research Phase", "Testing Phase", or "Prototype Ready"
- `statusTags`: Array that may include "Open Source", "Available Free", or "Monetized"
- `superpowers`, `painPointsAddressed`, `keyDesignConsiderations`, `fullDescription`: JSON stored as text strings

### Get Product by Slug

#### GET /api/products/slug/:slug

Get a specific product by its slug (URL-friendly identifier).

**Example:** `/api/products/slug/my-awesome-product`

**Response:** Single product object.

**Error Response (404):**
```json
{
  "error": "Product not found"
}
```

### Get Product by ID

#### GET /api/products/:id

Get a specific product by its UUID.

**Response:** Single product object.

### Create Product

#### POST /api/products

Create a new product.

**Request Body:**
```json
{
  "title": "Product Name",
  "shortDescription": "Brief description",
  "detailedDescription": "Detailed description",
  "imageUrl": "https://example.com/image.jpg",
  "status": "Research Phase",
  "statusTags": ["Open Source"],
  "technologies": ["React"],
  "orderIndex": 0,
  "slug": "product-name"
}
```

**Response (201):** Returns the created product.

---

## Company Endpoints

### Get All Companies

#### GET /api/companies

Returns all companies.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Company Name",
    "logo": "https://example.com/logo.png",
    "roleTitle": "Senior Engineer",
    "roleDescription": "Built amazing things",
    "videoUrl": "https://example.com/video.mp4",
    "orderIndex": 0,
    "treeSize": "medium"
  }
]
```

**Field Notes:**
- `treeSize`: One of "large", "medium", or "small"

### Get Company by ID

#### GET /api/companies/:id

Get a specific company by its UUID.

**Response:** Single company object.

**Error Response (404):**
```json
{
  "error": "Company not found"
}
```

### Create Company

#### POST /api/companies

Create a new company.

**Request Body:**
```json
{
  "name": "Company Name",
  "logo": "https://example.com/logo.png",
  "roleTitle": "Senior Engineer",
  "roleDescription": "Built amazing things",
  "videoUrl": "https://example.com/video.mp4",
  "orderIndex": 0,
  "treeSize": "medium"
}
```

**Response (201):** Returns the created company.

### Update Company

#### PUT /api/companies/:id

Update an existing company. All fields are optional.

**Request Body:**
```json
{
  "name": "Updated Company Name",
  "treeSize": "large"
}
```

**Response:** Returns the updated company.

### Delete Company

#### DELETE /api/companies/:id

Delete a company.

**Response:** 204 No Content

---

## Error Responses

The API uses standard HTTP status codes:

- **200**: Success
- **201**: Created
- **204**: No Content (successful deletion)
- **400**: Bad Request (invalid data)
- **404**: Not Found
- **500**: Internal Server Error

Error responses include a JSON object:
```json
{
  "error": "Error message description"
}
```

---

## Rate Limiting

No rate limiting is currently implemented, but consider implementing it for production use.

---

## Example Usage

### JavaScript/TypeScript (Fetch API)

```javascript
// Get all products
const response = await fetch('https://your-worker-url.workers.dev/api/products');
const products = await response.json();

// Get product by slug
const product = await fetch('https://your-worker-url.workers.dev/api/products/slug/my-product')
  .then(res => res.json());

// Search thought leadership
const results = await fetch('https://your-worker-url.workers.dev/api/thought-leadership/search?q=ai')
  .then(res => res.json());

// Create thought leadership (POST)
const newItem = await fetch('https://your-worker-url.workers.dev/api/thought-leadership', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'New Article',
    shortDescription: 'Description here',
    hashtags: ['ai'],
    articleUrl: 'https://example.com/article'
  })
}).then(res => res.json());
```

### React Hook Example

```typescript
import { useEffect, useState } from 'react';

const API_BASE_URL = 'https://your-worker-url.workers.dev';

function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
}
```

---

## Implementation Notes for supergrover.ai

To enable API access from `https://supergrover.ai`, you'll need to add it to the allowed origins list in the CORS middleware. See the "Required Changes" section below.
