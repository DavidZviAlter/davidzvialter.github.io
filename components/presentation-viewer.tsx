"use client";
import {useEffect,useState} from "react";
import {Carousel,CarouselContent,CarouselItem,CarouselPrevious,CarouselNext,type CarouselApi} from "@/components/ui/carousel";

export function PresentationViewer({titles,basePath,label}:{titles:string[];basePath:string;label:string}){
 const [api,setApi]=useState<CarouselApi>();const [slide,setSlide]=useState(0);
 useEffect(()=>{if(!api)return;const sync=()=>setSlide(api.selectedScrollSnap());api.on("select",sync);return()=>{api.off("select",sync)}},[api]);
 return <div className="retail-presentation"><Carousel setApi={setApi} opts={{loop:false}} aria-label={label} className="slide-frame"><CarouselContent>{titles.map((title,i)=><CarouselItem key={i}><img src={`${basePath}/slide-${i+1}.webp`} alt={`Slide ${i+1}: ${title}`} width={1600} height={900} loading={i===0?"eager":"lazy"}/></CarouselItem>)}</CarouselContent><div className="slide-controls"><CarouselPrevious className="static translate-y-0 rounded-md"/><span aria-live="polite">{slide+1} / {titles.length}</span><a href={`${basePath}/slide-${slide+1}.webp`} target="_blank" rel="noopener noreferrer">Enlarge slide ↗</a><CarouselNext className="static translate-y-0 rounded-md"/></div></Carousel><p className="media-caption">Original group presentation · All {titles.length} slides, including charts and recommendations.</p></div>
}
