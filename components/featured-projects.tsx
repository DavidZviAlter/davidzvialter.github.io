"use client";
import {useState} from "react";
import {ArrowUpRight,ChevronLeft,ChevronRight} from "lucide-react";
import type {Project} from "@/content/projects";
import {GenrePlot} from "@/components/movie-charts";
import {RetailPreferenceHighlight} from "@/components/retail-charts";

export function FeaturedProjects({projects}:{projects:Project[]}){
 const [active,setActive]=useState(0);if(!projects.length)return null;
 const move=(direction:number)=>setActive(current=>(current+direction+projects.length)%projects.length);
 return <div className="hero-analysis featured-projects" role="region" aria-roledescription="carousel" aria-label="Project highlights" tabIndex={0} data-featured-carousel onKeyDown={e=>{if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();move(e.key==="ArrowRight"?1:-1)}}}>
  {projects.map((p,i)=><section key={p.slug} hidden={active!==i} data-featured-panel={i} data-featured-slug={p.slug} role="group" aria-roledescription="slide" aria-label={`${i+1} of ${projects.length}: ${p.title}`}><div className="panel-heading"><span className="eyebrow">{p.slug==="retail-shopping"?"AN INSIGHT WE FOUND":p.category==="Group project"?"A QUESTION WE EXPLORED":"A QUESTION I EXPLORED"}</span><span className="mono muted">{String(i+1).padStart(2,"0")} / {p.slug==="movie-investment"?"EXCEL":p.slug==="retail-shopping"?"SQL + EXCEL":p.tools.slice(0,2).join(" + ")}</span></div><h2>{p.slug==="movie-investment"?<>Higher return,<br/>{" "}At what risk?</>:p.slug==="retail-shopping"?<>Which products<br/>{" "}deserve priority?</>:p.title}</h2><div className="featured-visual">{p.slug==="movie-investment"?<GenrePlot compact/>:p.slug==="retail-shopping"?<RetailPreferenceHighlight/>:<p className="featured-summary">{p.summary}</p>}</div><div className="plot-footer"><span>{p.slug==="movie-investment"?"Movie investment analysis":p.title}</span><a href={`/projects/${p.slug}/`} aria-label={`Read ${p.title} case study`}><ArrowUpRight size={22}/></a></div></section>)}
  {projects.length>1&&<div className="featured-navigation"><button type="button" onClick={()=>move(-1)} aria-label="Previous project" data-featured-prev><ChevronLeft size={19}/></button><span className="mono muted" aria-live="polite" aria-atomic="true" data-featured-position>{active+1} / {projects.length}</span><button type="button" onClick={()=>move(1)} aria-label="Next project" data-featured-next><ChevronRight size={19}/></button></div>}
 </div>
}
