"use client";
import {useState, type CSSProperties} from "react";
import {Tabs,TabsList,TabsTrigger,TabsContent} from "@/components/ui/tabs";
import movie from "@/content/movie-data.json";
const mint="#75e3c4",purple="#bda5fa";
type Strategy="comedy"|"drama";

// Both layouts include every genre label; CSS selects the available viewport.
export function GenrePlot({compact=false}:{compact?:boolean}){
 const [selected,setSelected]=useState<string|null>(null);
 const active=movie.genres.find(d=>d.name===selected);
 const renderPlot=(mobile:boolean)=>{
  const left=mobile?38:48,right=mobile?296:508,top=mobile?64:28,bottom=mobile?300:224;
  const x=(risk:number)=>left+risk/800*(right-left),y=(roi:number)=>bottom-roi/150*(bottom-top);
  const labels:Record<string,{x:number;y:number;anchor:"start"|"end"}>=mobile?{
   Comedy:{x:139,y:161,anchor:"start"},Drama:{x:266,y:82,anchor:"end"},Biography:{x:146,y:197,anchor:"start"},Adventure:{x:144,y:234,anchor:"start"},Action:{x:157,y:270,anchor:"start"},Crime:{x:147,y:300,anchor:"start"}
  }:{Comedy:{x:205,y:111,anchor:"start"},Drama:{x:462,y:46,anchor:"end"},Biography:{x:229,y:155,anchor:"start"},Adventure:{x:164,y:180,anchor:"start"},Action:{x:114,y:200,anchor:"end"},Crime:{x:174,y:219,anchor:"start"}};
  return <svg key={mobile?"mobile":"desktop"} className={`genre-svg genre-svg-${mobile?"mobile":"desktop"}`} viewBox={mobile?"0 0 330 375":"0 0 550 300"} role="img" aria-label="Six genres: average ROI against risk, measured as ROI standard deviation.">
   <text className="genre-axis-title" x={left} y={top-14} fill="#adbfca" fontSize="16">Average ROI (%)</text>
   {[0,50,100,150].map(t=><g key={t}><line x1={left} x2={right} y1={y(t)} y2={y(t)} stroke="#293c46" strokeDasharray="3 5"/><text x={left-10} y={y(t)+4} textAnchor="end" fill="#b0c0cb" fontSize="14">{t}</text></g>)}
   {[0,200,400,600,800].map(t=><g key={t}><line x1={x(t)} x2={x(t)} y1={top} y2={bottom} stroke="#293c46" strokeDasharray="3 5"/><text x={x(t)} y={bottom+24} textAnchor="middle" fill="#b0c0cb" fontSize="14">{t}</text></g>)}
   <path d={`M ${left} ${top} V ${bottom} H ${right}`} fill="none" stroke="#708897" strokeWidth="1"/>
   <text className="genre-axis-title" x={right} y={bottom+54} textAnchor="end" fill="#adbfca" fontSize="16">Risk (ROI std. dev., pp)</text>
   {movie.genres.map(d=>{const label=labels[d.name],color=d.name==="Comedy"?mint:d.name==="Drama"?purple:"#a3b3bf";return <g key={d.name} className="genre-point" tabIndex={0} aria-label={`${d.name}: ${d.roi.toFixed(1)}% average ROI; ${d.risk.toFixed(1)} pp volatility`} onMouseEnter={()=>setSelected(d.name)} onMouseLeave={()=>setSelected(null)} onFocus={()=>setSelected(d.name)} onBlur={()=>setSelected(null)}>
    <title>{`${d.name}: ${d.roi.toFixed(1)}% ROI / ${d.risk.toFixed(1)} pp volatility`}</title>
    <line x1={x(d.risk)} y1={y(d.roi)} x2={label.x+(label.anchor==="start"?-5:5)} y2={label.y-5} stroke={color} strokeOpacity=".6" strokeWidth=".9"/>
    <circle cx={x(d.risk)} cy={y(d.roi)} r="12" fill="transparent"/>
    <circle data-genre={d.name} cx={x(d.risk)} cy={y(d.roi)} r={d.name==="Comedy"||d.name==="Drama"?6:4.5} fill={color} stroke="#101b24" strokeWidth="1.5"/>
    <text className="genre-name" x={label.x} y={label.y} textAnchor={label.anchor} fill={color} fontSize="17">{d.name}</text>
   </g>})}
  </svg>;
 };
 return <div className={compact?"genre-plot compact":"genre-plot"}>
  {renderPlot(false)}{renderPlot(true)}
  {!compact&&<><p className="point-readout" aria-live="polite">{active?`${active.name}: ${active.roi.toFixed(1)}% ROI · ${active.risk.toFixed(1)} pp volatility`:"Hover or focus a point to see its values."}</p><details className="chart-data"><summary>View all six genre values</summary><div className="data-table-wrap"><table><caption className="sr-only">Genre returns and volatility</caption><thead><tr><th>Genre</th><th>Average ROI</th><th>Volatility</th></tr></thead><tbody>{movie.genres.map(d=><tr key={d.name}><th scope="row">{d.name}</th><td>{d.roi.toFixed(1)}%</td><td>{d.risk.toFixed(1)} pp</td></tr>)}</tbody></table></div></details></>}
 </div>;
}

function BudgetPlot({strategy}:{strategy:Strategy}){
 const data=movie.strategies[strategy].budgets;
 // Shared -100% to +350% scale in both tabs makes the strategies comparable.
 const x=(roi:number)=>142+(roi+100)/450*380,zero=x(0);
 return <div className="budget-plot"><svg className="budget-svg" viewBox="0 0 610 286" role="img" aria-label={`${strategy} budget groups, average ROI. Exact ROI, volatility and ratio values follow in the table.`}>
  {[-100,0,100,200,300].map(t=><g key={t}><line x1={x(t)} x2={x(t)} y1="25" y2="236" stroke={t===0?"#8397a3":"#293c46"} strokeDasharray={t===0?undefined:"3 5"}/><text x={x(t)} y="265" textAnchor="middle" fontSize="14" fill="#aebfc9">{t}%</text></g>)}
  {data.map((d,i)=><g key={d.name}><title>{`${d.name}: ${d.roi.toFixed(2)}% average ROI; ${d.risk.toFixed(2)} pp volatility`}</title><text x="127" y={53+i*54} textAnchor="end" fontSize="15" fill="#c4d1da">{d.name}</text><rect data-budget={d.name} x={Math.min(zero,x(d.roi))} y={34+i*54} width={Math.abs(x(d.roi)-zero)} height="28" rx="3" fill={strategy==="comedy"?mint:purple} opacity={d.roi<0?.6:1}/><text x={d.roi<0?zero+9:x(d.roi)+9} y={53+i*54} fontSize="15" fill="#e0e8ec">{d.roi.toFixed(1)}%</text></g>)}
 </svg><div className="budget-mobile" aria-label={`${strategy} average ROI by budget`}>{data.map(d=><div className="budget-mobile-row" key={d.name}><span>{d.name}</span><strong>{d.roi.toFixed(1)}%</strong><div className="budget-mobile-track"><i className="budget-zero"/><span style={{left:`${(Math.min(0,d.roi)+100)/450*100}%`,width:`${Math.abs(d.roi)/450*100}%`,background:strategy==="comedy"?mint:purple,opacity:d.roi<0?.6:1}}/></div></div>)}<p className="axis-caption">Shared scale: −100% to +350%. The vertical line marks 0%.</p></div></div>;
}

function ActorDecision({strategy}:{strategy:Strategy}){
 return <section className="case-section actor-decision" id="actor-decision"><p className="eyebrow">05 / A DECISION IN DETAIL</p>
  <div data-actor-for="comedy" hidden={strategy!=="comedy"}><h2>Why I preferred Steve Carell.</h2><div className="insight-panel"><div><h3>The highest average wasn’t my only criterion.</h3><p>Joseph Gordon-Levitt had the higher average ROI: 461.59%, compared with Steve Carell’s 432.94%. Carell’s lower variability produced the stronger ROI-over-risk ratio, which better suited the conservative strategy.</p><p className="source-note">Slide 8 · Three films per actor. The ratio is average ROI divided by its sample standard deviation.</p></div><div className="actor-comparison"><div className="actor-row"><span>Steve Carell</span><strong>2.32</strong><div className="actor-bar"><span style={{width:"100%"}}/></div></div><div className="actor-row"><span>Joseph Gordon-Levitt</span><strong>2.10</strong><div className="actor-bar"><span style={{width:`${2.096231124210531/2.3169725703551745*100}%`}}/></div></div><p className="source-note">Average ROI / standard deviation · Compared on the same scale.</p></div></div></div>
  <div data-actor-for="drama" hidden={strategy!=="drama"}><h2>Why I highlighted Ryan Gosling.</h2><div className="insight-panel"><div><h3>High returns with a more consistent record.</h3><p>Within the drama comparison, Ryan Gosling combined a 229.96% average ROI with a standard deviation of 53.94 percentage points. That combination made him the actor I highlighted for the aggressive strategy in the presentation.</p><p className="source-note">Slide 15 · Three films in the workbook’s drama actor comparison. This small sample does not predict future performance.</p></div><div className="actor-metrics"><div><strong>229.96%</strong><span>Average ROI</span></div><div><strong>53.94 pp</strong><span>ROI standard deviation</span></div><div><strong>4.26</strong><span>Average ROI / standard deviation</span></div></div></div></div>
 </section>;
}

export function StrategyExplorer(){
 const [strategy,setStrategy]=useState<Strategy>("comedy");
 return <><section className="case-section" id="strategies"><p className="eyebrow">04 / EXPLORE THE RESULTS</p><h2>One analysis. Two approaches.</h2><p>Switch strategies to explore the results and the actor behind each recommendation.</p>
 <div className="explorer" style={{"--strategy-color":strategy==="comedy"?mint:purple} as CSSProperties}><Tabs value={strategy} onValueChange={v=>setStrategy(v as Strategy)}><TabsList className="strategy-tabs"><TabsTrigger value="comedy" data-strategy-select="comedy">Conservative / Comedy</TabsTrigger><TabsTrigger value="drama" data-strategy-select="drama">Aggressive / Drama</TabsTrigger></TabsList>
 {(["comedy","drama"] as const).map(key=>{const d=movie.strategies[key];return <TabsContent value={key} key={key} forceMount hidden={key!==strategy} data-strategy={key}>
  <div className="strategy-overview"><div><span className="eyebrow">{key==="comedy"?"THE MORE CONSERVATIVE STRATEGY":"THE HIGHER-VOLATILITY STRATEGY"}</span><h3>{d.heading}</h3><p>{d.description}</p></div><div className="metric-pair"><div><strong>{d.roi.toFixed(1)}<small>%</small></strong><span>Average ROI</span></div><div><strong>{d.risk.toFixed(1)}<small> pp</small></strong><span>ROI standard deviation</span></div></div></div>
  <div className="decision-grid"><div><span>Budget profile</span><strong>$10M–$40M</strong><p>Medium budget in the original recommendation.</p></div><div><span>Actor highlighted</span><strong>{d.actor}</strong><p>{d.actorNote}</p></div><div><span>Director highlighted</span><strong>{d.director}</strong><p>{d.directorNote}</p></div></div>
  <div className="budget-explorer"><div className="chart-heading"><h4>Budget changes the trade-off</h4><span>Average ROI (%)</span></div><BudgetPlot strategy={key}/><div className="data-table-wrap"><table><caption className="sr-only">{key} budget comparison</caption><thead><tr><th>Budget</th><th>Average ROI</th><th>ROI std. dev.</th><th>ROI / risk</th></tr></thead><tbody>{d.budgets.map(b=><tr key={b.name}><th scope="row">{b.name}</th><td>{b.roi.toFixed(2)}%</td><td>{b.risk.toFixed(2)} pp</td><td>{(b.roi/b.risk).toFixed(2)}</td></tr>)}</tbody></table></div></div>
  <p className="source-note">Source: {d.source}. These are separate comparisons, not a combined model predicting a new film’s return.</p>
 </TabsContent>})}</Tabs></div></section><ActorDecision strategy={strategy}/></>;
}
