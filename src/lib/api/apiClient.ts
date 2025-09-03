

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = {
  get: async <T = any>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();
   

    if (!responseText) {
      return {} as T;
    }

    // Check if response looks like JSON
    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
       
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      // console.error("Response is not JSON:", responseText);
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },

  post: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      // console.error(`POST ${url} failed:`, response.status, errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();
   

    if (!responseText) {
      return {} as T;
    }

    // Check if response looks like JSON
    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
       
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
     
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },

  put: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      // console.error(`PUT ${url} failed:`, response.status, errorText);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();
   

    if (!responseText) {
      return {} as T;
    }

    // Check if response looks like JSON
    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
       
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      // console.error("Response is not JSON:", responseText);
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },

  patch: async <T = any>(url: string, data?: any): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();
   

    if (!responseText) {
      return {} as T;
    }

    // Check if response looks like JSON
    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      // console.error("Response is not JSON:", responseText);
      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },

  delete: async <T = any>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      const errorText = await response.text();
     
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    const responseText = await response.text();
   

    if (!responseText) {
      return {} as T;
    }

    // Check if response looks like JSON
    if (
      responseText.trim().startsWith("{") ||
      responseText.trim().startsWith("[")
    ) {
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
       
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {

      throw new Error(
        `Expected JSON response but got: ${responseText.substring(0, 200)}...`
      );
    }
  },
};
