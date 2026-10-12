from pathlib import Path
import datetime,json
ROOT=Path(__file__).resolve().parent
OUTPUT_ROOT=ROOT.parent
themes=[]
for path in sorted(ROOT.glob('readings_[1-5].txt')):
    for line in path.read_text().splitlines():
        if not line.strip():continue
        if line.startswith('@'):
            theme,body=line[1:].split('|',1);themes.append({'theme':theme,'body':body,'focus':[]})
        else:
            title,insight,action=line.split('|');themes[-1]['focus'].append((title,insight,action))
assert len(themes)==52,len(themes)
assert all(len(t['focus'])==7 for t in themes)
readings={}
for i in range(364):
    # A theme returns about seven weeks later with a new focus, rather than
    # repeating the same introductory paragraph on consecutive calendar days.
    theme=themes[i%52];title,insight,action=theme['focus'][i//52]
    date=datetime.date(2025,1,1)+datetime.timedelta(days=i);key=date.strftime('%m-%d')
    readings[key]={'date':key,'theme':theme['theme'],'title':title,'reflection':insight+' '+theme['body'],'action_step':action,'attribution':'Original QSRecovery reflection. Peer-support and educational content; not official AA or ACA literature.'}
readings['12-31']={'date':'12-31','theme':'The next honest step','title':'There is room to keep going','reflection':'A year can hold progress, pain, ordinary days and things you still do not understand. You do not have to force it into a perfect success story or a verdict of failure. Notice the support you used, the choices you want to keep practising and the help you may still need. The next useful step can be small, honest and within reach.','action_step':'Choose one realistic support contact or recovery practice for tomorrow.','attribution':'Original QSRecovery reflection. Peer-support and educational content; not official AA or ACA literature.'}
assert len(readings)==365
assert len({r['title'] for r in readings.values()})==365
assert len({r['reflection'] for r in readings.values()})==365
(OUTPUT_ROOT/'daily_readings.json').write_text(json.dumps(readings,ensure_ascii=False,indent=2)+'\n')
print('365 complete, individually dated original readings generated; dates, titles and full reflections are unique.')
