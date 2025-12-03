'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { questionsService, Question } from '@/lib/questions';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { MessageCircle, User, Clock } from 'lucide-react';

const questionSchema = z.object({
  content: z.string().min(5, 'La pregunta debe tener al menos 5 caracteres'),
  guestName: z.string().optional(),
  guestEmail: z.string().email('Email inválido').optional(),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

interface ProductQuestionsProps {
  productId: string;
}

export function ProductQuestions({ productId }: ProductQuestionsProps) {
  const { user } = useAuthStore();
  const { addToast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
  });

  useEffect(() => {
    loadQuestions();
  }, [productId]);

  const loadQuestions = async () => {
    try {
      const data = await questionsService.findByProduct(productId);
      setQuestions(data);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: QuestionFormValues) => {
    setSubmitting(true);
    try {
      await questionsService.create({
        ...data,
        productId,
      });
      addToast('Pregunta enviada correctamente', 'success');
      reset();
      loadQuestions();
    } catch (error) {
      addToast('Error al enviar la pregunta', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preguntas y Respuestas</h2>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {user ? `Hola ${user.name}, ¿tienes alguna duda?` : '¿Tienes alguna duda? Pregúntanos'}
        </h3>

        <div className="space-y-4">
          <textarea
            {...register('content')}
            placeholder="Escribe tu pregunta aquí..."
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none h-24"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}

          {!user && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre (Opcional)"
                {...register('guestName')}
                error={errors.guestName?.message}
              />
              <Input
                label="Email (Para notificarte)"
                type="email"
                {...register('guestEmail')}
                error={errors.guestEmail?.message}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" isLoading={submitting}>
              Enviar Pregunta
            </Button>
          </div>
        </div>
      </form>

      {/* Lista de Preguntas */}
      <div className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-gray-100 dark:bg-gray-700 rounded-xl" />
            ))}
          </div>
        ) : questions.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Aún no hay preguntas sobre este producto. ¡Sé el primero!
          </p>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {question.user?.name || question.guestName || 'Usuario Anónimo'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{question.content}</p>

                  {question.answer && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg ml-4 border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                        Respuesta de Refrielectricos:
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">{question.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
