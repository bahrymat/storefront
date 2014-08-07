#!/bin/sh
# Data was obtained for the following levels of concurrency: 5 10 50 100 200 350 500 750 1000.
# Unfortunately, Chart.js had difficulty accomodating the full set in a single graph, so the data
# was pruned down to 5 50 200 500 1000, in order to lessen the load on Chart.js, while maintaining 
# a relevent degree of experimentation.

for i in 5 10 50 100 200 350 500 750 1000
do
	#Examples page
	ab -n 3000 -c $i  localhost:8080/examples >> ./loadtest/examplepage.txt
	#Front page	
	ab -n 3000 -c $i  localhost:8080/ >> ./loadtest/frontpage.txt
	#About us page
	ab -n 3000 -c $i  localhost:8080/about >> ./loadtest/aboutpage.txt
	#Store front page
	ab -n 3000 -c $i  localhost:8080/store/qwerty/ >> ./loadtest/qwertypage.txt
	#Store products page
	ab -n 3000 -c $i  localhost:8080/store/qwerty/products >> ./loadtest/qwertyproductspage.txt
	#Store contact us page
	ab -n 3000 -c $i  localhost:8080/store/qwerty/contact >> ./loadtest/qwertycontactpage.txt
	#Store search, single result
	ab -n 3000 -c $i  localhost:8080/store/qwerty/search?q=sleek >> ./loadtest/qwertysearchpage.txt
	#Store search, multiple results
	ab -n 3000 -c $i  localhost:8080/store/qwerty/search?q=brown >> ./loadtest/qwertymultisearchpage.txt
	#Individual product page
	ab -n 3000 -c $i  localhost:8080/store/qwerty/product/7 >> ./loadtest/qwertyscottishpage.txt
	#Edit page populator request
	ab -n 3000 -c $i localhost:8080/getstoredata/chairstore@things.com >> ./loadtest/chairgetdata.txt
	

done
