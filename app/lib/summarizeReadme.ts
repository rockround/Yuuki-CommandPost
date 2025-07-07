import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// Zod schema for output structure
const summarySchema = z.object({
  summary: z.string(),
  cool_facts: z.array(z.string())
});

// Output parser for structured output
const outputParser = StructuredOutputParser.fromZodSchema(summarySchema);

// Prompt template
const prompt = PromptTemplate.fromTemplate(
  `Summarize this GitHub repository from this README file content.

README:
{readme}

Return a JSON object with:
- "summary": a concise summary of the repository (1-2 paragraphs)
- "cool_facts": an array of 3-5 interesting or unique facts about the repository

{format_instructions}
`
);

// The chain: prompt -> LLM -> output parser
const summarizerChain = RunnableSequence.from([
  async (input: { readme: string }) => ({
    readme: input.readme,
    format_instructions: outputParser.getFormatInstructions(),
  }),
  prompt,
  new ChatOpenAI({
    temperature: 0.3,
    modelName: "gpt-3.5-turbo",
  }),
  new StringOutputParser(),
  async (raw: string) => outputParser.parse(raw)
]);

export async function summarizeReadme(readme: string) {
  return summarizerChain.invoke({ readme });
} 