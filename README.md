Hello,

This NodeJS software is quite abomination. Due to the fact that you wanted it to be 3000tps I made this benchmark script
It works if you are running intel i7 or comparable. This however is not a good way of doing it so if you have apache AB or comparable use that and the function.
Benchmark function DOES work and it runs reaching 2500-3000tps average and maximum of 6400 in my computer.
Here's print screen about it: 
http://imgur.com/YzYqEny

The code itself is just a example how to read and write to events and also how to load user database. This however works bit wrong atm. (due to the fact that it's running the insertion multiple times.)
I made the script just to show how to work with the node js driver. 
It would need a lot more work before production or anything else. I hope this shows how to the async stuff with VoltDB.

The system uses two tables that use UserID as partitioning table to save events and users to same partition. 

Cheers!