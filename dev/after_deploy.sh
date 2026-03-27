rm /tmp/out/shiori/www/audio/bgm/{Battle,Castle,Ship}*
rm /tmp/out/shiori/www/audio/me/{Defeat,Gameover,Victory}*
rm /tmp/out/shiori/www/audio/se/{Run,Shop}*
rm -rf /tmp/out/shiori/www/dev
rm /tmp/out/shiori/www/img/battlebacks*/*
rm /tmp/out/shiori/www/translationengine.html

# Linux game executable backup file
rm /tmp/out/shiori/Game.desktop~ 2>/dev/null

cp /home/paul/rpgmaker/shiori/img/system/{bgsprite,title_image,Window_}* /tmp/out/shiori/www/img/system
cp /home/paul/rpgmaker/shiori/img/titles1/Shiori_full.png /tmp/out/shiori/www/img/titles1
cp /home/paul/rpgmaker/shiori/audio/se/{Computer,Crow}* /tmp/out/shiori/www/audio/se
