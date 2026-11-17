import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const directory='docs/engineering-showcase/screenshots';
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/usr/bin/google-chrome',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],report=[];
const page=await browser.newPage({viewport:{width:1440,height:1100}});
page.on('pageerror',e=>errors.push(e.message));
const projects=[['colas-scan-epi','scan'],['mediaspot','cloud'],['jetson-vision','vision'],['securispot','interface'],['edge-delivery','delivery'],['elk-exploitation','observability']];
const base='http://127.0.0.1:4173/portofolio/';
async function shot(locator,name) {
 await locator.screenshot({path:`${directory}/${name}.jpg`,type:'jpeg',quality:88,style:'.dialog-top,.site-header,.skip-link { visibility:hidden!important; }'});
 report.push({name,viewport:page.viewportSize(),horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});
}
for(const [id,type] of projects){
 await page.goto(base+'#projet/'+id);
 const demo=page.locator('dialog [data-demo="'+type+'"]');
 await demo.waitFor();
 if(['scan','cloud','vision','delivery'].includes(type))await demo.locator('canvas[data-context="ready"]').waitFor();
 await demo.locator('.architecture-stages button').first().click();
 await page.waitForTimeout(1000);
 await shot(demo,'after-1440-'+type+'-initial');
 if(type==='scan'||type==='vision'){
  for(const index of[1,2,type==='vision'?4:3]){
   await demo.locator('.architecture-stages button').nth(index).click();await page.waitForTimeout(450);
   await shot(demo.locator('.lab-three-story'),`after-1440-${type}-stage-${index+1}`);
  }
 }
 if(['scan','cloud','vision'].includes(type)){
  for(const [name,label] of[['detail','Équipement'],['architecture','Architecture'],...(type==='cloud'?[]:[['comparison','Comparer']])]){
   await demo.getByRole('button',{name:label,exact:true}).click();
   if(type==='cloud'&&name==='architecture')await demo.locator('.architecture-stages button').nth(3).click();
   await page.waitForTimeout(2000);await shot(demo.locator('.lab-three-story'),`after-1440-${type}-${name}`);
  }
 }
}
for(const width of[320,393]){
 await page.setViewportSize({width,height:1000});
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const [id,type] of projects){
  await page.goto(base+'#projet/'+id);const demo=page.locator('dialog [data-demo="'+type+'"]');await demo.waitFor();
  await shot(demo,`after-${width}-${type}`);
 }
}
for(const width of[360,768,1024,1440]){
 await page.setViewportSize({width,height:1000});
 await page.goto(base);await page.locator('h1').waitFor();
 await page.screenshot({path:`${directory}/after-${width}-portfolio.jpg`,type:'jpeg',quality:85});
 report.push({name:`after-${width}-portfolio`,viewport:page.viewportSize(),horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)});
}
await writeFile(`${directory}/review-report.json`,JSON.stringify({errors,captures:report},null,2));
await browser.close();
console.log(JSON.stringify({errors,captures:report.length,overflow:report.filter(r=>r.horizontalOverflow)}));
