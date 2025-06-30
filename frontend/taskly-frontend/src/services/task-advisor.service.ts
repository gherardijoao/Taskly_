export interface TaskSuggestion {
  dicas: string[];
  resumo: string;
}

export class TaskAdvisorService {
  private static readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  /**
   * Gera conselhos personalizados para completar uma tarefa usando a API Gemini
   * @param context - O contexto da tarefa que o usuário quer completar
   * @returns Promise com dicas e resumo motivacional
   */
  static async generateAdvice(context: string): Promise<TaskSuggestion> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Chave da API Gemini não configurada');
    }

    const prompt = this.buildPrompt(context);

    try {
      const response = await fetch(
        `${this.GEMINI_API_URL}?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao comunicar com a API Gemini');
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      return this.parseResponse(text);
    } catch (error) {
      console.error('Erro ao gerar conselhos:', error);
      return this.getFallbackAdvice();
    }
  }

  /**
   * Constrói o prompt para a API Gemini
   */
  private static buildPrompt(context: string): string {
    return `
Você é um consultor especialista em produtividade e organização pessoal. Sua função é ajudar pessoas a completarem tarefas específicas, fornecendo dicas práticas, estratégias e sugestões personalizadas.

Com base no contexto abaixo, gere uma lista de dicas e orientações para que a pessoa consiga cumprir a tarefa com mais facilidade, motivação e eficiência.

A resposta deve ser em formato JSON seguindo EXATAMENTE esta estrutura:
{
  "dicas": [
    "Dica 1 aqui",
    "Dica 2 aqui",
    "Dica 3 aqui"
  ],
  "resumo": "Um breve resumo motivacional ou estratégico para a pessoa completar a tarefa."
}

Contexto da tarefa: ${context}

Não inclua backticks, comentários ou qualquer outro texto antes ou depois do JSON.
`;
  }

  /**
   * Faz o parse da resposta da API Gemini
   */
  private static parseResponse(text: string): TaskSuggestion {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      let jsonText = jsonMatch ? jsonMatch[0] : text;
      jsonText = jsonText.replace(/```json|```/g, '').trim();
      const suggestion = JSON.parse(jsonText);
      
      const dicas = Array.isArray(suggestion.dicas) ? suggestion.dicas : [];
      const resumo = typeof suggestion.resumo === 'string' ? suggestion.resumo : '';
      
      return { dicas, resumo };
    } catch (error) {
      console.error('Erro ao fazer parse da resposta:', error);
      return this.getFallbackAdvice();
    }
  }

  /**
   * Retorna conselhos padrão em caso de erro
   */
  private static getFallbackAdvice(): TaskSuggestion {
    return {
      dicas: [
        'Divida a tarefa em etapas menores.',
        'Defina um prazo realista.',
        'Elimine distrações e foque no objetivo.'
      ],
      resumo: 'Mantenha-se motivado e avance um passo de cada vez para concluir sua tarefa!'
    };
  }
} 