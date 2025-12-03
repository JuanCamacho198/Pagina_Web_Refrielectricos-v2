import api from './api';

export interface Question {
  id: string;
  content: string;
  answer?: string;
  user?: {
    id: string;
    name: string;
  };
  guestName?: string;
  createdAt: string;
  isAnswered: boolean;
}

export interface CreateQuestionDto {
  content: string;
  productId: string;
  guestName?: string;
  guestEmail?: string;
}

export const questionsService = {
  create: async (data: CreateQuestionDto) => {
    const response = await api.post('/questions', data);
    return response.data;
  },

  findByProduct: async (productId: string): Promise<Question[]> => {
    const response = await api.get(`/questions/product/${productId}`);
    return response.data;
  },

  findByUser: async () => {
    const response = await api.get('/questions/user');
    return response.data;
  },
};
