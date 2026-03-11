

fly machines list -a claudia-db

fly machines start 7847922b201248 -a claudia-db

fly proxy 15432:5432 -a claudia-db

fly deploy

fly agent stop

fly wireguard list


fly postgres connect -a claudia-db


7847922b201248

fly machines restart 7847922b201248 -a claudia-db