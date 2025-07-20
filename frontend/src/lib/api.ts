const API_BASE_URL = 'https://curiousdevs0-1.onrender.com';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  location: string;
  role: 'admin' | 'customer';
}

export interface userToken{
  token : string;
}
export interface Project {
  id: string;
  user_id: string;
  title: string;
  service_type: string;
  status: string;
  total_amount: number;
  paid_amount: number;
  start_date?: string;
  end_date?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface leadCreate{
      name: string;
    email: string;
    mobile: string;
    project: string;
    project_type: string;
    project_details:string;
}


export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

export interface Newsletter{
  email:string
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async signup(userData: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
    location: string;
  }): Promise<{ user: User; token: string }> {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('token');
  }
  
  //create Lead 
    async leadCreate(name: string, email: string, mobile: string, project: string, project_type: string, project_details:string,): Promise<{ lead: User; status: string }> {
    const response = await this.request('/lead/create', {
      method: 'POST',
      body: JSON.stringify({name,email,mobile,project,project_type,project_details}),
    });
    console.log("PNKAJJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",response)
    return response;
  }
  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null;
    
    try {
      return await this.request('/auth/me');
    } catch {
      this.token = null;
      localStorage.removeItem('token');
      return null;
    }
  }

  // Projects methods
  async getProjects(): Promise<Project[]> {
    return this.request('/projects');
  }

  async createProject(projectData: {
    title: string;
    service_type: string;
    description: string;
  }): Promise<Project> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }
 
  // Contact requests
  async createContactRequest(contactData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }): Promise<ContactRequest> {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getContactRequests(): Promise<ContactRequest[]> {
    return this.request('/contact');
  }

  // Newsletter
  async subscribeNewsletter(email: string): Promise<void> {
    await this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const apiClient = new ApiClient();