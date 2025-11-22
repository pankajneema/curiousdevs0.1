// Use environment variable or detect from window location
const getApiBaseUrl = () => {
  // Try environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // If running on a network IP, use that IP for API
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    const hostname = window.location.hostname;
    return `http://${hostname}:5000`;
  }
  
  // Fallback to localhost
  return 'http://localhost:5000';
};

const API_BASE_URL =   'https://curiousdev-one.vercel.app' //getApiBaseUrl();
console.log('API Base URL:', API_BASE_URL);

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
export interface Phase {
  name: string;
  status: string;
  completed_on?: string;
}

export interface Project {
  id: string;
  created_by: string;
  title: string;
  service_type: string;
  status: string;
  description: string;
  created_at: string;
  updated_at: string;
  progress_percentage?: number;
  tech_stack?: string[];
  project_lead_id?: string;
  assigned_team?: string[];
  phases?: Phase[];
  demo_link?: string;
  payment_link?: string;
  payment_status?: string;
  project_amount?: number;
  paid_amount?: number;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface Bill {
  id: string;
  project_id: string;
  user_id: string;
  amount: number;
  due_date: string;
  issued_on: string;
  status: string;
  paid_on?: string;
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

    // Get token from localStorage if not already set
    if (!this.token) {
      this.token = localStorage.getItem('token');
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errorData.message || errorData.detail || `API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string): Promise<{ user: User; token: string; status: string }> {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.status === "success" && response.token) {
      this.token = response.token;
      localStorage.setItem('token', response.token);
      return {
        status: response.status,
        token: response.token,
        user: response.user
      };
    } else {
      throw new Error(response.message || "Login failed");
    }
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
    try {
      // Try to call logout endpoint if it exists, but don't fail if it doesn't
      await this.request('/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      this.token = null;
      localStorage.removeItem('token');
    }
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
      const user = await this.request('/auth/me');
      // Ensure user object has all required fields
      if (user && user.id) {
        return {
          id: user.id,
          email: user.email || '',
          full_name: user.full_name || user.name || '',
          phone: user.phone || '',
          location: user.location || '',
          role: user.role || 'customer'
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      this.token = null;
      localStorage.removeItem('token');
      return null;
    }
  }

  // Projects methods
  async getProjects(): Promise<Project[]> {
    try {
      const projects = await this.request('/project/all');
      return Array.isArray(projects) ? projects : [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async createProject(projectData: {
    title: string;
    service_type?: string;
    description: string;
  }): Promise<{ status: string; message: string; project: Project }> {
    return this.request('/project/create', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getProjectDetails(id: string): Promise<Project> {
    return this.request(`/project/details/${id}`);
  }

  async updateProject(id: string, projectData: {
    status?: string;
    tech_stack?: string[];
    project_lead_id?: string;
    assigned_team?: string[];
    progress_percentage?: number;
    demo_link?: string;
    payment_link?: string;
    payment_status?: string;
    phases?: Phase[];
    project_amount?: number;
    paid_amount?: number;
  }): Promise<{ status: string; message: string; project: Project }> {
    return this.request(`/project/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async sendProjectMessage(projectId: string, message: string): Promise<{ status: string; message: string }> {
    return this.request('/project/message', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId, message }),
    });
  }

  async getProjectMessages(projectId: string): Promise<Message[]> {
    return this.request(`/project/messages/${projectId}`);
  }

  async processProjectPayment(projectId: string): Promise<{ status: string; message: string; paid_amount: number }> {
    return this.request(`/project/payment/${projectId}`, {
      method: 'POST',
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
    try {
      const contacts = await this.request('/contact');
      return Array.isArray(contacts) ? contacts : [];
    } catch (error) {
      console.error('Error fetching contact requests:', error);
      return [];
    }
  }

  // Newsletter
  async subscribeNewsletter(email: string): Promise<void> {
    await this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Bills
  async getMyBills(): Promise<Bill[]> {
    return this.request('/bill/my');
  }

  async getAllBills(): Promise<Bill[]> {
    return this.request('/bill/all');
  }

  async createBill(billData: {
    project_id: string;
    amount: number;
    due_date: string;
  }): Promise<{ status: string; message: string; bill: Bill }> {
    return this.request('/bill/create', {
      method: 'POST',
      body: JSON.stringify(billData),
    });
  }

  async markBillAsPaid(billId: string): Promise<{ status: string; message: string }> {
    return this.request(`/bill/payment/${billId}`, {
      method: 'PUT',
    });
  }

  // Leads (admin only)
  async getAllLeads(): Promise<any[]> {
    return this.request('/lead/all');
  }
}

export const apiClient = new ApiClient();
