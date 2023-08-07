import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import fs from "fs";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";
import chalk from "chalk";

const VECTOR_PATH = "./data/Documents.index";
const model = new ChatOpenAI({});

export const qa = async (readline) => {
  // LOAD PDF DATA
  const loader = new DirectoryLoader("./files", {
    ".pdf": (path) => new PDFLoader(path),
  });
  const docs = await loader.load();

  let vectorStore;

  if (fs.existsSync(VECTOR_PATH)) {
    // 14. Load the existing vector store
 
    vectorStore = await HNSWLib.load(
      VECTOR_PATH,
      new HuggingFaceInferenceEmbeddings()
    );
   
 
  } else {
    // 15. Create a new vector store if one does not exist
 
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const normalizedDocs = normalizeDocuments(docs);

    
    const splitDocs = await textSplitter.createDocuments(normalizedDocs);
    
    // 16. Generate the vector store from the documents
    vectorStore = await HNSWLib.fromDocuments(
      splitDocs,
      new HuggingFaceInferenceEmbeddings()
    );
    // 17. Save the vector store to the specified path
    await vectorStore.save(VECTOR_PATH);

 
  }

  // 18. Create a retrieval chain using the language model and vector store
 
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      memory: new BufferMemory({
        memoryKey: "chat_history", // Must be set to "chat_history"
      }),
    }
  );

  // 19. Query the retrieval chain with the specified question
  
  const res = await chain.call({ question: "Tell me about these docs" + + "\n" });
  
  let userInput = await readline.question(chalk.green(res.text) + "\n\n");
  
  while (userInput !== "q") {
  
    try {
      
        
        const response = await chain.call({
          question: userInput,
        });
        
    
        let botMessage =  await response.text;
        if (botMessage) {
          
          userInput = await readline.question("\n" + chalk.green(botMessage) + "\n\n");
        } else {
          userInput = await readline.question("\nNo response, try asking again\n");
        }
      } catch (error) {
        console.log(error.message);
        userInput = await readline.question("\nSomething went wrong, try asking again\n");
      }
    }
  
    console.log(chalk.red("\n" + "Hasta luego :)" + "\n"));
    
    readline.close();
};

function normalizeDocuments(docs) {
  return docs.map((doc) => {
    if (typeof doc.pageContent === "string") {
      return doc.pageContent;
    } else if (Array.isArray(doc.pageContent)) {
      return doc.pageContent.join("\n");
    }
  });
}
