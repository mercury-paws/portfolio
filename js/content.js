'use strict';
// Browser-only enhancement. Edit JSON and publish the files; no generator is used.
(() => {
  const root = new URL('../', document.currentScript.src);
  const lang = document.documentElement.lang || 'en';
  const page = document.body.dataset.page || '';
  const copy = {
    en:{read:'Read article',back:'All articles',search:'Search articles',none:'No articles found. Try another word.',missing:'Article not found',missingText:'This article is no longer available. Browse the other articles below.',fallback:'The latest article data could not be loaded. The saved content is still available.',empty:'There are no published articles yet.',original:'Articles are shown in their original English.',private:'Reviews appear in their original language.'},
    cs:{read:'Číst článek',back:'Všechny články',search:'Hledat články',none:'Žádné články nenalezeny. Zkuste jiné slovo.',missing:'Článek nenalezen',missingText:'Článek není dostupný. Níže najdete další články.',fallback:'Nejnovější články se nepodařilo načíst. Uložený obsah je stále dostupný.',empty:'Zatím nejsou publikovány žádné články.',original:'Články jsou uvedeny v původní angličtině.',private:'Recenze jsou uvedeny v původním jazyce.'},
    ru:{read:'Читать статью',back:'Все статьи',search:'Найти статью',none:'Статей не найдено. Попробуйте другое слово.',missing:'Статья не найдена',missingText:'Эта статья недоступна. Другие статьи приведены ниже.',fallback:'Не удалось загрузить свежие данные. Сохранённый текст по-прежнему доступен.',empty:'Опубликованных статей пока нет.',original:'Статьи представлены в оригинале на английском.',private:'Отзывы представлены на языке оригинала.'},
    uk:{read:'Читати статтю',back:'Усі статті',search:'Знайти статтю',none:'Статей не знайдено. Спробуйте інше слово.',missing:'Статтю не знайдено',missingText:'Ця стаття недоступна. Інші статті наведено нижче.',fallback:'Не вдалося завантажити свіжі дані. Збережений текст залишається доступним.',empty:'Опублікованих статей поки немає.',original:'Статті представлені в оригіналі англійською.',private:'Відгуки представлені мовою оригіналу.'}
  }[lang] || {};
  const folder = {en:'pages',cs:'pagescz',ru:'pagesru',uk:'pagesuk'}[lang] || 'pages';
  const text = value => typeof value === 'string' ? value : '';
  const element = (tag, value, className) => {
    const el = document.createElement(tag);
    if (value !== undefined) el.textContent = String(value);
    if (className) el.className = className;
    return el;
  };
  const safeURL = value => {
    try { const url = new URL(value, root); return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  };
  async function read(name) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(new URL('data/' + name, root), {signal:controller.signal,cache:'no-cache'});
      if (!response.ok) throw new Error('Content unavailable');
      return await response.json();
    } finally { clearTimeout(timeout); }
  }
  // Rebuild the allowed markup as new DOM nodes. Do not insert arbitrary JSON as HTML.
  function articleHTML(source) {
    const parsed = new DOMParser().parseFromString(source, 'text/html');
    const result = document.createDocumentFragment();
    const allowed = new Set(['P','BR','STRONG','EM','B','I','U','SPAN','BLOCKQUOTE','UL','OL','LI','H2','H3','H4','A','CODE']);
    const blocked = new Set(['SCRIPT','STYLE','IFRAME','OBJECT','EMBED','FORM','SVG','MATH','IMG','LINK','META','BASE']);
    function walk(node,parent) {
      if (node.nodeType === 3) { parent.append(document.createTextNode(node.textContent)); return; }
      if (node.nodeType !== 1 || blocked.has(node.tagName)) return;
      let target = parent;
      if (allowed.has(node.tagName)) {
        target = document.createElement(node.tagName.toLowerCase());
        if (['blog-bold','blog-quote'].includes(node.getAttribute('class'))) target.className = node.getAttribute('class');
        if (node.tagName === 'A') {
          const href = node.getAttribute('href') || '';
          if (href.startsWith('#')) target.setAttribute('href',href);
          else { const url=safeURL(href);if(url)target.setAttribute('href',url); }
        }
        parent.append(target);
      }
      for (const child of node.childNodes) walk(child,target);
    }
    for (const child of parsed.body.childNodes) walk(child,result);
    return result;
  }
  const articleURL = id => new URL(folder + '/blogArticle.html?id=' + encodeURIComponent(id), root).href;
  function card(item,index) {
    const el = element('article',undefined,'blog-card');el.lang='en';el.dataset.search=[item.title,item.header].join(' ');
    el.append(element('span',`${String(index+1).padStart(2,'0')} / ${text(item.date)}`,'index'));
    const heading=element('h2');const link=element('a',item.title);link.href=articleURL(item._id);heading.append(link);el.append(heading,element('p',item.header));
    const more=element('a',copy.read+' ↗','text-link');more.href=link.href;more.lang=lang;el.append(more);return el;
  }
  function grid(items) {
    const el=element('div',undefined,'blog-grid');items.forEach((item,i)=>el.append(card(item,i)));return el;
  }
  function filter() {
    const search=document.querySelector('#blog-search');if(!search)return;
    const query=search.value.trim().toLocaleLowerCase();const cards=[...document.querySelectorAll('.blog-card')];
    cards.forEach(el=>el.hidden=!el.dataset.search.toLocaleLowerCase().includes(query));
    const none=document.querySelector('#no-results');if(none)none.hidden=cards.some(el=>!el.hidden);
  }
  async function articles() {
    try {
      const data=await read('blogs.json');if(!Array.isArray(data.items))throw new Error('Invalid article data');
      const items=data.items.filter(x=>x&&/^[a-zA-Z0-9_-]+$/.test(x._id)&&typeof x.title==='string'&&typeof x.text==='string').sort((a,b)=>(a.order||0)-(b.order||0));
      if (page==='blog') {
        const old=document.querySelector('.blog-grid');if(old)old.replaceWith(grid(items));
        const search=document.querySelector('#blog-search');if(search){search.closest('.search-field').hidden=false;filter();}
        if(!items.length){const status=document.querySelector('.content-status');status.hidden=false;status.textContent=copy.empty;}
        return;
      }
      const id=page.startsWith('article-')?page.slice(8):new URLSearchParams(location.search).get('id');
      if(!id){const old=document.querySelector('.blog-grid');if(old)old.replaceWith(grid(items));return;}
      const item=items.find(x=>x._id===id);const main=document.querySelector('main');
      const back=element('a','← '+copy.back,'text-link');back.href=new URL(folder+'/blog.html',root).href;
      main.className='container article-page';
      if(!item){main.replaceChildren(element('h1',copy.missing),element('p',copy.missingText),back,grid(items));document.title=copy.missing+' · mercury_paws';return;}
      const article=element('article');article.lang='en';const heading=element('h1',item.title);const date=element('p',item.date,'article-date');const prose=element('div',undefined,'prose article-prose');prose.append(articleHTML(item.text));article.append(heading,date,prose);
      main.replaceChildren(back);
      if(lang!=='en')main.append(element('p',copy.original,'translation-note'));
      main.append(article,back.cloneNode(true));document.title=item.title+' · mercury_paws';
      const canonical=document.querySelector('link[rel="canonical"]');if(canonical)canonical.href=articleURL(id);
      for(const a of document.querySelectorAll('.languages a')){const target={en:'pages',cs:'pagescz',ru:'pagesru',uk:'pagesuk'}[a.hreflang];if(target)a.href=new URL(target+'/blogArticle.html?id='+encodeURIComponent(id),root).href;}
      for(const a of document.querySelectorAll('head link[rel="alternate"]')){const target={en:'pages',cs:'pagescz',ru:'pagesru',uk:'pagesuk'}[a.hreflang];if(target)a.href=new URL(target+'/blogArticle.html?id='+encodeURIComponent(id),root).href;}
    } catch {
      const status=document.querySelector('.content-status');if(status){status.hidden=false;status.textContent=copy.fallback;}
    }
  }
  async function reviews() {
    try {
      const data=await read('reviews.json');if(!Array.isArray(data))return;
      const target=document.querySelector('.review-grid');if(!target)return;
      const fragment=document.createDocumentFragment();
      data.filter(x=>x&&typeof x.name==='string'&&typeof x.comment==='string').forEach(x=>{const figure=element('figure');const quote=element('blockquote',x.comment);if(x.lang)quote.lang=x.lang;figure.append(quote,element('figcaption','— '+x.name));fragment.append(figure);});
      target.replaceChildren(fragment);
      if(!data.length)target.closest('.reviews-section').hidden=true;
    } catch { /* Existing review HTML remains visible. */ }
  }
  function field(dl,label,value) {
    if(!value)return;
    const row=element('div');row.append(element('dt',label),element('dd',value));dl.append(row);
  }
  function groupedSkills(values,labels,className) {
    const dl=element('dl',undefined,className);const sets={Languages:[],Libraries:[],Styling:[],Tools:[],Data:[]};
    for(const value of values){let group=['HTML','CSS','JavaScript','TypeScript'].includes(value)?'Languages':['React','Redux','Express','Node.js'].includes(value)?'Libraries':['Sass','Tailwind CSS','CSS Grid'].includes(value)?'Styling':['MongoDB','MySQL'].includes(value)?'Data':'Tools';sets[group].push(value);}
    for(const [key,list] of Object.entries(sets))if(list.length)field(dl,labels[key]||key,list.join(', '));return dl;
  }
  async function projectContent() {
    try {
      const [data,allLabels]=await Promise.all([read('projects.json'),read('project-labels.json')]);if(!Array.isArray(data.items))return;const labels=allLabels[lang]||allLabels.en;
      for(const item of data.items){
        const loc=item.translations?.[lang]||{};const values={...item,...loc};
        const card=[...document.querySelectorAll('[data-project-card]')].find(el=>el.dataset.projectCard===item.id);
        if(card){card.querySelector('.project-status').textContent=labels[item.status]||item.status;card.querySelector('.project-purpose').textContent=text(values.problem);const old=card.querySelector('.card-skills');if(old)old.replaceWith(groupedSkills(item.technology||[],labels,'card-skills'));}
        const overview=[...document.querySelectorAll('[data-project-id]')].find(el=>el.dataset.projectId===item.id);
        if(!overview)continue;
        const container=element('div',undefined,'container');container.append(element('p',labels[item.status]||item.status,'project-status'),element('h2',labels.overview));
        const dl=element('dl',undefined,'project-facts');
        for(const key of ['problem','scope','role','challenge','rationale','learning','outcomes','next'])field(dl,labels[key],text(values[key]));
        container.append(dl,groupedSkills(item.technology||[],labels,'project-facts project-technologies'));
        const url=item.demo&&safeURL(item.demo);if(url){const link=element('a',labels.demo+' ↗','text-link');link.href=url;container.append(link);}
        overview.replaceChildren(container);
      }
    } catch { /* Existing project facts remain readable. */ }
  }
  // Local files retain their saved HTML; fetch is used only when served over HTTP(S).
  if(!['http:','https:'].includes(location.protocol))return;
  if(page==='blog'||page==='blogArticle'||page.startsWith('article-'))articles();
  if(page==='home')reviews();
  if(document.querySelector('[data-project-card], [data-project-id]'))projectContent();
})();
