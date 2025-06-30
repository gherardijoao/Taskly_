import { GoogleGenerativeAI } from '@google/generative-ai';

interface TaskSuggestionOptions {
  context?: string;
  categoria?: string;
  preferencias?: string;
}

interface TaskSuggestion {
  nome: string;
  descricao: string;
  categoria?: string;
}

export class SuggestionService {
  private genAI: GoogleGenerativeAI;
  
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY não configurada. O serviço de sugestões não funcionará corretamente.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }
  
  async generateTaskSuggestion(options: TaskSuggestionOptions = {}): Promise<{ dicas: string[]; resumo: string }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      let prompt = `
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

Contexto da tarefa: ${options.context || ''}
${options.categoria ? `Categoria (opcional): ${options.categoria}` : ''}
${options.preferencias ? `Preferências do usuário (opcional): ${options.preferencias}` : ''}

Não inclua backticks, comentários ou qualquer outro texto antes ou depois do JSON.
`;
      
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Processar e validar a resposta JSON
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        let jsonText = jsonMatch ? jsonMatch[0] : text;
        jsonText = jsonText.replace(/```json|```/g, '').trim();
        const suggestion = JSON.parse(jsonText);
        const dicas = Array.isArray(suggestion.dicas) ? suggestion.dicas : [];
        const resumo = typeof suggestion.resumo === 'string' ? suggestion.resumo : '';
        return { dicas, resumo };
      } catch (error) {
        // fallback: tentar extrair dicas e resumo com regex
        const dicas: string[] = [];
        const dicasMatch = text.match(/"dicas"\s*:\s*\[(.*?)\]/s);
        if (dicasMatch && dicasMatch[1]) {
          dicasMatch[1].split(',').forEach(dica => {
            const clean = dica.replace(/(^\s*"|"\s*$)/g, '').trim();
            if (clean) dicas.push(clean);
          });
        }
        const resumoMatch = text.match(/"resumo"\s*:\s*"([^"]+)"/);
        const resumo = resumoMatch && resumoMatch[1] ? resumoMatch[1].trim() : '';
        return {
          dicas: dicas.length > 0 ? dicas : ['Divida a tarefa em etapas menores.', 'Defina um prazo realista.', 'Elimine distrações e foque no objetivo.'],
          resumo: resumo || 'Mantenha-se motivado e avance um passo de cada vez para concluir sua tarefa!'
        };
      }
    } catch (error) {
      return {
        dicas: ['Divida a tarefa em etapas menores.', 'Defina um prazo realista.', 'Elimine distrações e foque no objetivo.'],
        resumo: 'Mantenha-se motivado e avance um passo de cada vez para concluir sua tarefa!'
      };
    }
  }
} 