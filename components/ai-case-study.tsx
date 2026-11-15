import {LiveAIPreview} from "./live-ai-preview";
import {BriefcaseBusiness, Code2, Image, Search, ArrowUpRight} from "lucide-react";
import catalog from "@/content/ai-catalog.json";

const tasks = [
  {id:"everyday", label:"Everyday work", icon:BriefcaseBusiness, description:"Text-answer preference, with style controlled. A signal for general assistant tasks."},
  {id:"coding", label:"Coding", icon:Code2, description:"Preference on web development tasks. This does not cover every programming language or workflow."},
  {id:"images", label:"Images", icon:Image, description:"Text-to-image and image-editing results, weighted equally. Models need both tests to qualify."},
  {id:"research", label:"Research", icon:Search, description:"Search-answer preference, with style controlled. It does not independently establish factual accuracy."},
] as const;
const brands:Record<string,string>={openai:"OpenAI",anthropic:"Claude",google:"Gemini",perplexity:"Perplexity"};
function leaders(task:typeof tasks[number]["id"]) {
  const groups=catalog.evidence.category_groups[task];
  const weights=catalog.model_comparison.weights as Record<string,number>;
  const ranked=catalog.model_comparison.models.flatMap(model=>{
    const scores=model.scores as Record<string,{percentile:number|null}|undefined>;
    if(!groups.every(g=>Number.isFinite(scores[g]?.percentile)))return [];
    return [{model,score:groups.reduce((n,g)=>n+Number(scores[g]?.percentile)*weights[g],0)/groups.reduce((n,g)=>n+weights[g],0)}];
  }).sort((a,b)=>b.score-a.score);
  return ranked.filter(r=>Math.abs(r.score-ranked[0].score)<1e-9);
}
export function AIProjectPreview({compact=false}:{compact?:boolean}) {
  const initial = Object.fromEntries(tasks.map(task => {
    const picks=leaders(task.id);
    return [task.id,{brand:picks.length?[...new Set(picks.map(p=>brands[p.model.provider.toLowerCase()]||p.model.provider))].join(" / "):"Awaiting evidence", model:picks.map(p=>p.model.name).join(" / ")}];
  }));
  return <LiveAIPreview compact={compact} initial={initial}/>;
}

export function AICaseStudy(){return <>
  <section className="case-section ai-research-opening"><p className="eyebrow">01 / THE QUESTION</p>
    <div className="ai-question-layout"><div><h2>Which AI is worth using?<br/><span>And worth paying for?</span></h2><p>New models arrive constantly. The goal is to connect the work you need to do with evidence about performance, access and limits.</p></div>
    <ol className="ai-decision-path"><li><span>01</span><div><strong>Start with the task</strong><p>Everyday work, code, images or research.</p></div></li><li><span>02</span><div><strong>Compare the evidence</strong><p>Exact models and shared benchmark tests.</p></div></li><li><span>03</span><div><strong>Check the plan</strong><p>Free or paid access, features and limits.</p></div></li></ol></div>
  </section>
  <section className="case-section"><p className="eyebrow">02 / FOUR CATEGORIES</p><h2>Different jobs. Different evidence.</h2>
    <div className="ai-category-grid">{tasks.map(task=>{const Icon=task.icon;return <article data-task={task.id} key={task.id}><Icon size={24}/><h3>{task.label}</h3><p>{task.description}</p></article>})}</div>
  </section>
  <section className="case-section"><p className="eyebrow">03 / THE METRICS</p><h2>Make the comparison fair before averaging.</h2>
    <div className="ai-method-panel"><div><span className="mono">RELATIVE RANK / 0–100</span><h3>Position within a test.</h3><p>Each Arena rating becomes a percentile within the collected four-provider cohort. Equal ratings share a midrank. A score of 100 means the highest relative position in that test; it is not 100% accuracy.</p></div>
    <div><span className="mono">SHARED TESTS ONLY</span><h3>Same evidence. Same weights.</h3><p>Comparisons use tests available for every selected model. Missing results are not treated as zero. A broader average requires at least two shared tests; a single test stays a category score.</p></div>
    </div>
    <p className="preview-note">Votes, published uncertainty bounds and test dates provide context in the comparison. Small ranking differences should not be read as proven superiority.</p>
  </section>
  <section className="case-section"><p className="eyebrow">04 / DATA WORKFLOW</p><h2>From changing sources to one usable dataset.</h2>
    <ol className="ai-pipeline"><li><span>01</span><h3>Collect</h3><p>Python reads Arena results and the public OpenRouter model catalog. Plan details are reviewed against provider documentation.</p></li><li><span>02</span><h3>Validate</h3><p>Check structure, exact model identities and source records before computing relative scores.</p></li><li><span>03</span><h3>Build</h3><p>Generate one complete data.js file. If validation fails, the previous release stays in place.</p></li><li><span>04</span><h3>Publish</h3><p>Run the updater manually, review the output and replace the published file through GitHub.</p></li></ol>
    <p>OpenRouter supplies model specifications, separately from benchmark scores. The refresh needs no API key. It does not automatically verify subscription access or changing usage caps.</p>
  </section>
  <section className="case-section"><p className="eyebrow">05 / RESULTS & LIMITS</p><h2>A shortlist with evidence behind it.</h2><AIProjectPreview/>
    <p>The tool compares four products and eight plans, with company-to-model selection, category filters and CSV export. Free recommendations reflect documented feature access; they are not a benchmark ranking of free subscriptions.</p>
    <p>A tested model configuration may not match what a subscription serves. Rankings also depend on the collected providers, dates and test coverage. The next improvement is stronger model-to-plan mapping and more comparable evidence across tasks.</p>
    <div className="ai-tool-launch"><h3>Explore the comparisons.</h3><p>Inspect model scores, plan features and the linked sources.</p><a className="action primary" href="/ai-tool-comparison/">Open comparison <ArrowUpRight size={18}/></a></div>
    <p className="preview-note">For independent educational purposes. Source attribution, benchmark licensing and provider documentation are listed in the tool’s Sources, methodology & specifications section.</p>
  </section>
</>}
