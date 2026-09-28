const categories = ['Home & furniture','Everyday essentials','Personal care','Tech & accessories','Fitness & wellness',
'Footwear & apparel'];

const difficulties = ['Simple','Moderate','Highly constrained'];

const failureTags = ['Missing constraint','Weak differentiation','Unavailable or stale link','Price uncertainty',
'Generic explanation'];

const evaluations = Array.from( {
  length:36
},(_,i)=> {
  const base = i%7===0?3:i%5===0?3.5:4;
  const v = [base,Math.max(2,base-(i%4===0?1:0)),base+(i%3===0?.5:0),Math.max(2.5,base-(i%6===0?1:.5)),
  Math.max(2.5,base-(i%4===1?.5:0))].map(x=>Math.min(5,x));
  return {
    category:categories[Math.floor(i/6)],difficulty:difficulties[i%3],scores: {
      relevance:v[0],constraints:v[1],explanation:v[2],readiness:v[3],variety:v[4]
    },failureTags:i%4===0?[failureTags[i%5]]:i%5===0?[failureTags[(i+1)%5]]:[]
  }
});

const criterionWeights =  {
  relevance:.25,constraints:.30,explanation:.15,readiness:.20,variety:.10
};

const average = a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0,compositeScore=r=>20*Object.keys(criterionWeights).reduce((s,k)=>s+r.scores[k]*criterionWeights[k],
0);

function wilsonInterval(x,n) {
  if(!n)return[0,0];
  const z = 1.96,p=x/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,h=z*Math.sqrt((p*(1-p)+z*z/(4*n))/n)/d;
  return[(c-h)*100,(c+h)*100]
}

const averageByGroup = (data,key)=>Object.fromEntries([...new Set(data.map(r=>r[key]))].map(v=>[v,average(data.filter(r=>r[key]===v).map(compositeScore))]));

function renderDashboard() {
  const c = document.querySelector('#category').value,d=document.querySelector('#difficulty').value,data=evaluations.filter(r=>(c==='All categories'||r.category===c)&&(d==='All difficulties'||r.difficulty===d));
  const success = data.filter(r=>compositeScore(r)>=70&&r.scores.constraints>=4).length,ci=wilsonInterval(success,data.length),
  crit=Object.fromEntries(Object.keys(criterionWeights).map(k=>[k,average(data.map(r=>r.scores[k]))])),fail=Object.entries(data.flatMap(r=>r.failureTags).reduce((a,
  t)=>(a[t]=(a[t]||0)+1,a), {
  })).sort((a,b)=>b[1]-a[1]);

document.querySelector('#metrics').innerHTML=[['Composite score',average(data.map(compositeScore)).toFixed(1),'Weighted score · out of 100'],
  ['Constraints satisfied',`${(100*data.filter(r=>r.scores.constraints>=4).length/data.length||0).toFixed(1)}%`,
  'Constraint criterion ≥ 4/5'],['Successful recommendations',`${(100*success/data.length||0).toFixed(1)}%`,
  'Composite ≥ 70 + constraints ≥ 4'],['95% confidence interval',`${ci[0].toFixed(1)}–${ci[1].toFixed(1)}%`,
  `Wilson interval · n = ${data.length}`]].map(x=>`<article class="card metric"><p>${x[0]}</p><strong>${x[1]}</strong><span>${x[2]}</span></article>`).join('');

document.querySelector('#sample-note').innerHTML=`<span>Filtered sample: <b>${data.length}</b> of 36 scenarios</span><span>Segment results are directional. Aim for 20–30 genuine observations per segment.</span>`;
  renderBars('#category-chart',averageByGroup(data,'category'));
  renderBars('#difficulty-chart',averageByGroup(data,'difficulty'));

const sorted = Object.entries(crit).sort((a,b)=>b[1]-a[1]);
  document.querySelector('#criteria').innerHTML=sorted.map(([k,v],i)=>`<div class="criterion"><div><span>${k[0].toUpperCase()+k.slice(1)}</span><em class="pill ${i===0?'good':i===sorted.length-1?'bad':''}">${i===0?'Strongest':i===sorted.length-1?'Weakest':v.toFixed(1)}</em></div><progress max="5" value="${v}"></progress></div>`).join('');
  document.querySelector('#failures').innerHTML=fail.slice(0,5).map(([t,n],i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><b>${t}</b><em>${n}</em></li>`).join('')||'<li>No failure tags in this segment.</li>'
}

function renderBars(sel,obj) {
  document.querySelector(sel).innerHTML=Object.entries(obj).map(([k,v])=>`<div class="bar"><div><span>${k}</span><b>${v.toFixed(1)}</b></div><i><u style="width:${v}%"></u></i></div>`).join('')||'<p>No data.</p>'
}

const categorySelect = document.querySelector('#category');
categorySelect.innerHTML='<option>All categories</option>'+categories.map(x=>`<option>${x}</option>`).join('');
categorySelect.onchange=renderDashboard;
document.querySelector('#difficulty').onchange=renderDashboard;
document.querySelector('#reset').onclick=()=> {
  categorySelect.value='All categories';
  document.querySelector('#difficulty').value='All difficulties';
  renderDashboard()
};
renderDashboard();
