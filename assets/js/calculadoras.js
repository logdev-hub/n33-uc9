(() => {
  'use strict';
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const num = value => Number(String(value).trim().replace(/\./g, '').replace(',', '.'));
  const cleanNumber = value => Number(value);
  const panel = (title, body) => `<div class="result-panel"><h3 class="h5">${title}</h3>${body}</div>`;
  const error = (target, message) => target.innerHTML = panel('Revise os dados', `<p class="mb-0">${message}</p>`);

  document.getElementById('abcCalc')?.addEventListener('click', () => {
    const target = document.getElementById('abcResult');
    const lines = document.getElementById('abcInput').value.split(/\r?\n/).filter(line => line.trim());
    const items = lines.map(line => { const [name,q,c] = line.split(';'); return { name:name?.trim(), q:num(q), c:num(c) }; });
    if (!items.length || items.some(i => !i.name || !Number.isFinite(i.q) || !Number.isFinite(i.c) || i.q < 0 || i.c < 0)) return error(target, 'Use nome; quantidade; custo em todas as linhas, com valores não negativos.');
    items.forEach(i => i.value = i.q * i.c); items.sort((a,b) => b.value - a.value);
    const total = items.reduce((sum,i) => sum + i.value, 0); if (total <= 0) return error(target, 'O valor total precisa ser maior que zero.');
    let accumulated = 0;
    items.forEach(i => { const previous = accumulated; i.share = i.value / total * 100; accumulated += i.share; i.acc = accumulated; i.cls = previous < 80 ? 'A' : previous < 95 ? 'B' : 'C'; });
    const rows = items.map(i => `<tr class="abc-${i.cls}"><td>${i.name}</td><td>${i.q}</td><td>${money.format(i.c)}</td><td>${money.format(i.value)}</td><td>${i.share.toFixed(2)}%</td><td>${i.acc.toFixed(2)}%</td><td><strong>${i.cls}</strong></td></tr>`).join('');
    target.innerHTML = panel('Resultado e passo a passo', `<ol><li>Valor de consumo = quantidade × custo unitário.</li><li>Total = ${money.format(total)}; itens ordenados do maior para o menor.</li><li>% individual = valor do item ÷ total × 100; o acumulado orienta A (~80%), B (~80–95%) e C (~95–100%).</li></ol><div class="table-responsive"><table class="table data-table"><thead><tr><th>Item</th><th>Qtd.</th><th>Custo</th><th>Valor</th><th>%</th><th>% acum.</th><th>Classe</th></tr></thead><tbody>${rows}</tbody></table></div><p class="mb-0"><strong>Interpretação:</strong> itens A concentram a maior parcela do valor e merecem controle mais frequente, sem ignorar criticidade e risco.</p>`);
  });

  document.getElementById('fifoCalc')?.addEventListener('click', () => {
    const target = document.getElementById('fifoResult'); const lots=[]; const history=[];
    const lines = document.getElementById('fifoInput').value.split(/\r?\n/).filter(line => line.trim());
    try {
      lines.forEach((line,index) => {
        const [date,typeRaw,qRaw,cRaw] = line.split(';'); const type=typeRaw?.trim().toLowerCase(); const qty=num(qRaw); const cost=cRaw?.trim() ? num(cRaw) : 0;
        if (!date || !['entrada','saida','saída'].includes(type) || !Number.isFinite(qty) || qty <= 0) throw new Error(`Linha ${index+1}: movimento inválido.`);
        if (type === 'entrada') { if (!Number.isFinite(cost) || cost < 0) throw new Error(`Linha ${index+1}: custo inválido.`); lots.push({qty,cost}); history.push([date,'Entrada',qty,money.format(qty*cost),lots.reduce((s,l)=>s+l.qty,0),money.format(lots.reduce((s,l)=>s+l.qty*l.cost,0))]); }
        else { let remaining=qty, outValue=0, detail=[]; while (remaining>0 && lots.length) { const take=Math.min(remaining,lots[0].qty); outValue += take*lots[0].cost; detail.push(`${take} × ${money.format(lots[0].cost)}`); lots[0].qty-=take; remaining-=take; if(lots[0].qty===0) lots.shift(); } if(remaining>0) throw new Error(`Linha ${index+1}: saída maior que o saldo disponível.`); history.push([date,`Saída (${detail.join(' + ')})`,qty,money.format(outValue),lots.reduce((s,l)=>s+l.qty,0),money.format(lots.reduce((s,l)=>s+l.qty*l.cost,0))]); }
      });
    } catch (e) { return error(target,e.message); }
    const rows=history.map(row=>`<tr>${row.map(c=>`<td>${c}</td>`).join('')}</tr>`).join(''); const q=lots.reduce((s,l)=>s+l.qty,0), v=lots.reduce((s,l)=>s+l.qty*l.cost,0);
    target.innerHTML=panel('Kardex processado',`<ol><li>Cada entrada cria um lote com seu custo.</li><li>Cada saída consome primeiro o lote mais antigo.</li><li>O saldo preserva quantidade e custo dos lotes remanescentes.</li></ol><div class="table-responsive"><table class="table data-table"><thead><tr><th>Data</th><th>Histórico</th><th>Qtd.</th><th>Valor movimento</th><th>Saldo qtd.</th><th>Saldo valor</th></tr></thead><tbody>${rows}</tbody></table></div><p class="mb-0"><strong>Saldo final:</strong> ${q} unidades, avaliadas em ${money.format(v)}.</p>`);
  });

  document.getElementById('ppCalc')?.addEventListener('click', () => {
    const target=document.getElementById('ppResult'), avg=cleanNumber(document.getElementById('ppAvg').value), max=cleanNumber(document.getElementById('ppMax').value), lead=cleanNumber(document.getElementById('ppLead').value);
    if (![avg,max,lead].every(Number.isFinite) || avg<0 || max<avg || lead<0) return error(target,'Informe valores não negativos e consumo máximo maior ou igual ao médio.');
    const es=(max-avg)*lead, pp=avg*lead+es;
    target.innerHTML=panel('Resultado e passo a passo',`<p><strong>ES</strong> = (Consumo máximo − Consumo médio) × Tempo de reposição<br>ES = (${max} − ${avg}) × ${lead} = <strong>${es.toFixed(2)} unidades</strong></p><p><strong>PP</strong> = (Consumo médio × Tempo de reposição) + ES<br>PP = (${avg} × ${lead}) + ${es.toFixed(2)} = <strong>${pp.toFixed(2)} unidades</strong></p><p class="mb-0"><strong>Interpretação:</strong> ao atingir aproximadamente ${pp.toFixed(2)} unidades, inicia-se a reposição; ${es.toFixed(2)} unidades protegem a variação considerada.</p>`);
  });

  document.getElementById('eoqCalc')?.addEventListener('click', () => {
    const target=document.getElementById('eoqResult'), d=cleanNumber(document.getElementById('eoqD').value), s=cleanNumber(document.getElementById('eoqS').value), h=cleanNumber(document.getElementById('eoqH').value);
    if (![d,s,h].every(Number.isFinite) || d<=0 || s<=0 || h<=0) return error(target,'D, S e H precisam ser maiores que zero.'); const rad=(2*d*s)/h, q=Math.sqrt(rad);
    target.innerHTML=panel('Resultado e passo a passo',`<p>Q* = √((2 × D × S) ÷ H)</p><p>Q* = √((2 × ${d} × ${s}) ÷ ${h}) = √${rad.toFixed(2)} = <strong>${q.toFixed(2)} unidades</strong></p><p class="mb-0"><strong>Interpretação:</strong> ${Math.round(q)} unidades são uma referência de equilíbrio entre custos de pedir e manter. Valide embalagem, espaço, validade, caixa, demanda e lead time.</p>`);
  });

  document.getElementById('depCalc')?.addEventListener('click', () => {
    const target=document.getElementById('depResult'), cost=cleanNumber(document.getElementById('depCost').value), residual=cleanNumber(document.getElementById('depResidual').value), life=cleanNumber(document.getElementById('depLife').value);
    if (![cost,residual,life].every(Number.isFinite) || cost<0 || residual<0 || residual>cost || life<=0) return error(target,'Confira os valores: vida útil > 0 e valor residual entre zero e a aquisição.'); const annual=(cost-residual)/life;
    target.innerHTML=panel('Resultado e passo a passo',`<p>Depreciação anual = (Valor de aquisição − Valor residual) ÷ Vida útil</p><p>(${money.format(cost)} − ${money.format(residual)}) ÷ ${life} = <strong>${money.format(annual)} por ano</strong></p><p class="mb-0"><strong>Interpretação:</strong> o método distribui a base depreciável igualmente. Não representa sozinho estado físico nem valor de mercado.</p>`);
  });
})();

