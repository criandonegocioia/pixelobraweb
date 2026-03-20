#!/bin/sh
# Limpa locks do Chromium que ficam "presos" quando o container é recreated
find /wpp-auth -name 'SingletonLock' -o -name 'SingletonSocket' -o -name 'SingletonCookie' 2>/dev/null | xargs rm -f 2>/dev/null
echo "🧹 Chromium locks limpos"
exec node server.js
