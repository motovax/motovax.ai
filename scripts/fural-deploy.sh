#!/usr/bin/env bash
set -euo pipefail
# motovax.ai is served by GitHub Pages. The Docker image from this repo serves
# onboard.motovax.com. Resolve the correct Coolify app rather than using the
# organization-wide default, which belongs to motovax-app.
python3 - <<'PY'
import json, os, urllib.request
from pathlib import Path
config={}
for line in (Path.home()/'.env').read_text().splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        key,value=line.split('=',1)
        config[key.strip()]=value.strip().strip('\"\'')
base=config['COOLIFY_BASE_URL'].rstrip('/')
headers={'Authorization':'Bearer '+config['COOLIFY_DEPLOY_TOKEN'],'Accept':'application/json','User-Agent':'curl/8.0'}
def request(path):
    return json.load(urllib.request.urlopen(urllib.request.Request(base+path,headers=headers),timeout=45))
apps=request('/api/v1/applications')
matches=[app for app in apps if str(app.get('git_repository','')).removesuffix('.git')=='motovax/motovax.ai' and 'https://onboard.motovax.com' in str(app.get('fqdn','')) and app.get('git_branch')=='main']
if len(matches)!=1:
    raise SystemExit('Deploy dihentikan: target Coolify repo motovax.ai / onboard.motovax.com tidak unik.')
app=matches[0]
result=request('/api/v1/deploy?uuid='+app['uuid']+'&force=false')
print(json.dumps({'target':app['name'],'domain':'https://onboard.motovax.com','repository':app['git_repository'],'deployment':result}))
PY
