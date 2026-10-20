"""Rebuild the retail case-study aggregates from the unchanged course files.
Requires openpyxl. SQL is inspected using a temporary in-memory SQLite copy;
the source MySQL dump is never executed against an external database.
"""
from pathlib import Path
import collections
import json
import re
import sqlite3
import statistics
import openpyxl

ROOT=Path(__file__).resolve().parents[1]
book=openpyxl.load_workbook(ROOT/'public/files/Retail-Shopping-Analysis.xlsx',data_only=True)
values=list(book['main'].values)
rows=[dict(zip(values[0],row)) for row in values[1:] if row[0] is not None]
sql=(ROOT/'public/files/Retail-Shopping-Database.sql').read_text()
connection=sqlite3.connect(':memory:')
for match in re.finditer(r'CREATE TABLE `([^`]+)` (\(.*?\)) ENGINE=.*?;',sql,re.S):
    connection.execute('CREATE TABLE `'+match.group(1)+'` '+match.group(2))
for match in re.finditer(r'INSERT INTO `[^`]+` VALUES .*?;',sql,re.S):
    connection.executescript(match.group())
connection.row_factory=sqlite3.Row
joined=[dict(row) for row in connection.execute('SELECT a.*, b.* FROM table1 a JOIN table2 b ON a.`Customer ID`=b.`Customer ID`')]
lookup={row['Customer ID']:row for row in rows}
if len(lookup)!=len(rows) or len(joined)!=len(rows):raise ValueError('Customer ID does not produce a one-to-one join.')
if any(value!=lookup[row['Customer ID']][key] for row in joined for key,value in row.items()):raise ValueError('SQL and Excel source fields do not match.')
categories=collections.defaultdict(list)
products=collections.defaultdict(list)
for row in rows:
    categories[row['Category']].append(row)
    products[row['Item Purchased']].append(row)
summary={'records':len(rows),'revenue':sum(r['Purchase Amount (USD)'] for r in rows),'categories':[],'items':[]}
for name,group in categories.items():
    types=[v for v in products.values() if v[0]['Category']==name]
    revenue=sum(r['Purchase Amount (USD)'] for r in group)
    summary['categories'].append({'name':name,'purchases':len(group),'products':len(types),'revenue':revenue,'revenuePerProduct':revenue/len(types),'purchasesPerProduct':len(group)/len(types)})
for name,group in products.items():
    summary['items'].append({'name':name,'category':group[0]['Category'],'purchases':len(group),'rating':statistics.mean(r['Review Rating'] for r in group),'popularity':sum(r['Review Rating'] for r in group),'revenue':sum(r['Purchase Amount (USD)'] for r in group)})
summary['items'].sort(key=lambda r:r['popularity'],reverse=True)
summary['correlation']=statistics.correlation([r['rating'] for r in summary['items']],[r['purchases'] for r in summary['items']])
summary['promotion']={}
for key in ['Yes','No']:
    group=[r for r in rows if r['Discount Applied']==key]
    summary['promotion'][key]={'count':len(group),'averagePurchase':statistics.mean(r['Purchase Amount (USD)'] for r in group),'revenue':sum(r['Purchase Amount (USD)'] for r in group)}
summary['promoDiscountMismatches']=sum(r['Promo Code Used']!=r['Discount Applied'] for r in rows)
summary['exposureByCategory']=[]
for name,group in categories.items():
    result={'category':name}
    for key in ['Yes','No']:
        segment=[r for r in group if r['Discount Applied']==key]
        result[key]={'count':len(segment),'averagePurchase':statistics.mean(r['Purchase Amount (USD)'] for r in segment)}
    summary['exposureByCategory'].append(result)
summary['segments']=[]
for field in ['Gender','Subscription Status','Age Group','Season']:
    for value in sorted({r[field] for r in rows}):
        group=[r for r in rows if r[field]==value]
        summary['segments'].append({'field':field,'value':value,'count':len(group),'exposed':sum(r['Discount Applied']=='Yes' for r in group)})
(ROOT/'content/retail-data.json').write_text(json.dumps(summary,indent=2))
print(f'Wrote aggregates for {len(rows)} matching SQL/Excel records and {len(products)} product types.')
