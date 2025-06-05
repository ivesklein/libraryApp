interface LoginResponse {
  access_token: string;
}

interface LoginData {
  username: string;
  password: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  description?: string;
  available: boolean;
}

export interface PaginatedBooks {
  items: Book[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedApiBooks {
  data: Book[];
  meta: {
    total: number;
    page: number;
    limit: number;
  }
}

export interface BookPaginationParams {
  skip?: number;
  limit?: number;
  query?: string;
  sort1?: string;
  sort2?: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = '';
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.getToken()) {
      headers['Authorization'] = `Bearer ${this.getToken()}`;
    }

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 401) {
        // if 401 then logout
        this.clearToken();
        // let them know something is not cooking
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }

  // Auth methods
  async login(data: LoginData): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', 'POST', data);
    this.setToken(response.access_token);
    return response;
  }

  async logout() {
    this.clearToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Book methods
  async getBooks(params: BookPaginationParams = {}): Promise<PaginatedBooks> {
    const queryParams = new URLSearchParams();
    
    if (params.skip !== undefined) queryParams.append('skip', params.skip.toString());
    if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
    if (params.query) queryParams.append('query', params.query);
    if (params.sort1) queryParams.append('sort1', params.sort1);
    if (params.sort2) queryParams.append('sort2', params.sort2);
    
    const queryString = queryParams.toString();
    const endpoint = `/book${queryString ? `?${queryString}` : ''}`;
    
    try {
      const response = await this.request<PaginatedApiBooks>(endpoint);
      console.log('API response:', response);
      return {
        items: response.data || [],
        total: response.meta.total || 0,
        page: response.meta.page || 1,
        limit: response.meta.limit || params.limit || 10
      };
    } catch (error) {
      console.error('Error fetching books:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        limit: params.limit || 10
      };
    }
  }

  async getBook(id: number): Promise<Book> {
    return this.request<Book>(`/book/${id}`);
  }

  async createBook(book: Omit<Book, 'id'>): Promise<Book> {
    return this.request<Book>('/book', 'POST', book);
  }

  async updateBook(id: number, book: Partial<Book>): Promise<Book> {
    return this.request<Book>(`/book/${id}`, 'PATCH', book);
  }

  async deleteBook(id: number): Promise<void> {
    return this.request<void>(`/book/${id}`, 'DELETE');
  }
}

export const apiService = new ApiService();
export default apiService;