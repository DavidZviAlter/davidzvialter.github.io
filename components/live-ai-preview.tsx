"use client";
import {useEffect, useState} from "react";
import {BriefcaseBusiness, Code2, Image, Search} from "lucide-react";

type Picks = Record<string,{brand:string;model:string}>;
const tasks = [
  {id:"everyday",label:"Everyday work",icon:BriefcaseBusiness},
  {id:"coding",label:"Coding",icon:Code2},
  {id:"images",label:"Images",icon:Image},
  {id:"research",label:"Research",icon:Search},
];
const brands:Record<string,string>={openai:"OpenAI",anthropic:"Claude",google:"Gemini",perplexity:"Perplexity"};
let current:Promise<Picks>|undefined;
function loadPicks():Promise<Picks> {
  return current ??= fetch("/ai-tool-comparison/data.js",{cache:"no-cache"}).then(async response=>{
    if(!response.ok)throw new Error("Dataset unavailable");
    const text=await response.text();
    const prefix="window.YEDAVIO_DATA=";
    if(text.length>5*1024*1024||!text.startsWith(prefix))throw new Error("Invalid dataset");
    // Parse the updater's JSON envelope without executing downloaded JavaScript.
    const data=JSON.parse(text.slice(prefix.length).trim().replace(/;$/,""));
    const result:Picks={};
    for(const task of tasks){
      const groups:string[]=data.evidence.category_groups[task.id];
      const weights:Record<string,number>=data.model_comparison.weights;
      if(!groups.length||!groups.every(g=>Number.isFinite(weights[g])&&weights[g]>0))throw new Error("Invalid weights");
      const ranked=data.model_comparison.models.flatMap((model:{name:string;provider:string;scores:Record<string,{percentile:number|null}>})=>{
        if(typeof model.name!=="string"||typeof model.provider!=="string"||!groups.every(g=>Number.isFinite(model.scores[g]?.percentile)))return [];
        return [{name:model.name,provider:model.provider,score:groups.reduce((sum,g)=>sum+Number(model.scores[g].percentile)*weights[g],0)/groups.reduce((sum,g)=>sum+weights[g],0)}];
      }).sort((a:{score:number},b:{score:number})=>b.score-a.score);
      const picks=ranked.filter((r:{score:number})=>Math.abs(r.score-ranked[0].score)<1e-9) as {name:string;provider:string}[];
      result[task.id]={brand:picks.length?[...new Set(picks.map(p=>brands[p.provider.toLowerCase()]||p.provider))].join(" / "):"Awaiting evidence",model:picks.map(p=>p.name).join(" / ")};
    }
    return result;
  }).catch(error=>{current=undefined;throw error;});
}
export function LiveAIPreview({compact=false,initial}:{compact?:boolean;initial:Picks}){
  const [picks,setPicks]=useState(initial);
  useEffect(()=>{let active=true;loadPicks().then(value=>{if(active)setPicks(value);}).catch(()=>{});return()=>{active=false;};},[]);
  return <div className={`project-preview ai-project-preview${compact?" ai-preview-compact":""}`}>
    <p className="preview-caption mono">THE MODELS SETTING THE PACE</p>
    <div className="ai-winner-grid">{tasks.map(task=>{const Icon=task.icon;return <div className="ai-winner" data-task={task.id} key={task.id}>
      <span className="ai-task-label"><Icon size={16}/>{task.label}</span>
      <span className="ai-rank-mark" aria-label="Category leader">#1</span><strong>{picks[task.id].brand}</strong>
      <span className="ai-model-label">{picks[task.id].model}</span>
    </div>;})}</div>
    <p className="preview-note">Benchmark leaders · Paid-plan availability varies.</p>
  </div>;
}
