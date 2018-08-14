# Enhancing node performance - a simple express app

Mostly for my own reference, the repo was built while working through a udemy course - Node JS: Advanced Concepts.

Repo is a work in progress/will not contain all of the work completed in the course. Will add more notes and/or links to related work.

## Clustering
> common use case: the cluster module creates child processes that all share sever ports. Helps handle heavier loads by launching multiple Node.js processes/helps developers leverage multi-core systems.
>> Broadly used/well tested (esp. relative to working threads). A helpful/open source utility for clustering - [pm2](https://github.com/Unitech/pm2)

## Worker Threads
> common use case: creates a separate thread that can be used to complete intensive/calculation heavy work without blocking other processes running inside of the event loop.
>> caveat: quite a few node functions (e.g. fs module, the crypto.pbkdf2) already utilize the libuv threadpool (nodejs's existing threadpool) to execute code in a separate thread, so worker threads are likely most useful when it is useful to execute custom code off of the event loop thread.
