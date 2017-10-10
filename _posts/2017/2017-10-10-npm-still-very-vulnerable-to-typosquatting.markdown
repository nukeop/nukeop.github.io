---
layout: "post"
title: "npm still very vulnerable to typosquatting"
date: "2017-10-10 10:00"
tags: security npm javascript
image: "https://i.imgur.com/gmJbBlk.png"
summary: "Getting developers to execute arbitrary code made fun and easy"
---

A typosquatting attack is an attack that exploits common typos people make when manually typing in URLs, names, addresses, and so on. Some people noticed that because some package managers which are commonly used to install modules for some programming languages allow these modules to run arbitrary code during installation, it may become a very potent attack vector.

Recently a typosquatting attack was performed on pip, the Python package manager:

[Python's Official Repository Included 10 'Malicious' Typo-Squatting Modules][ref1]

## The npm vulnerability

Intrigued by the relative ease at which technology-literate people may be made to execute arbitrary code on their machines, I decided to perform my own experiment against npm, the Node.js package manager. Anyone can publish packages to npm after registering a free account. The uploaded packages are not examined by anyone. By defining a preinstall and postinstall scripts, you can run any code you like when somebody decides to install your package (or does it accidentally).

npm team have acknowledged this vulnerability in 2016 and published steps that can be taken to protect against it:

[Package install scripts vulnerability][ref2]

However, very little was done to prevent this vulnerability from being exploited from the npm side. They have even admitted they are pretty much powerless to stop malicious code in installation scripts and have few ideas how to address the problem. I have conducted an experiment to see if this is still a serious issue that can be used to reliably attack users. The answer is: yes.

## The attack

To determine some possibly effective typoed names, I pulled up the list of [npm's most popular packages][ref3] and chose two that would be easy to spell incorrectly: jquery and coffee-script. Then, I searched Github for some incorrectly spelled variants of these names, and created empty repositories for them. There are too many ways to make a typo in coffee-script to count; all different variations of omitting or adding an extra e, f, or hyphen amounted to around 7 names I was able to find on Github being used very often. With jquery, I've only found 'jquey' being popular.

For some time, these packages would only open my Github repository in the browser so I could look at the stats and see how many times somebody attempted to install them. After a while, I decided to collect more detailed data.

On server side, I have prepared a simple server in Flask that would accept only one kind of POST request. The payload had to be base64-encoded, and needed to include an md5 checksum for verification. Not too hard to reverse engineer, but it would probably stop people from just casually spamming my database. This server was deployed on Heroku on a free plan.

On client side, I have prepared a script that would be executed in the postinstallation step when somebody happens to download one of my packages. The node.js code would gather some info about the machine it was executing on, including the username, ip, the operating system, the original package name that was spelled with a typo, the recent bash history, and if the script was executed with root privileges. I have protected the script from easy reverse engineering via obfuscation. It was not meant to stop determined developers, just to avoid simple tampering with research data.

## The results

On average, the misspelled packages were installed around 10 times a day, often multiple times by the same users who failed to notice why they were installing the wrong module. If I was a black hat hacker, I could have taken over their machines and likely infected other devices on their local network, perhaps even steal login credentials or credit card info. Around half of the time, the installation script was executed with root privileges.

By examining bash histories, I've noticed that the most common way of installing typosquatting packages was by scripts that automated deployment - the script would include a name with a typo, and it would be installed along with many other dependencies, avoiding detection. Installing packages manually via `npm install` likely makes it easy to detect such avoidable mistakes.

All in all, I was able to keep the typosquatting packages up for around two weeks; after that time, Heroku has suspended my account, taking the Flask server offline, and npm replaced them with security placeholders such as [this one][ref4]. I suspect somebody noticed what was going on and informed Heroku and npm teams as they took action around the same time. However, two weeks would be more than enough for a malicious attacker to take over more than a hundred machines that have attempted to install my packages. Additionally, it would be equally as easy to just register under a new name and repeat the operation with different packages. A determined attacker could even automate the registration/publishing part and create hundreds of accounts with hundreds of typosquatting packages, and create a vast botnet in little time.

It is very startling that otherwise technically-skilled people who likely take security very seriously and would be otherwise much harder than average to attack. Those same technology experts are also very quick to run random code on their machines if it comes from programming language repositories, assuming it can be trusted by default.

## Mitigation

The preventative measures against typosquatting should be implemented mainly by the npm developers. Currently, they want to push all responsibility onto users, by recommending using `npm install --ignore-scripts` when installing untrusted packages. However, many packages require running installation scripts to function, as they compile some critical modules or perform other necessary setup. Experience shows that almost nobody does this.

They also recommend reporting any discovered worms to their security team. Other than that, their strategy for dealing with this threat is "hoping for the best".

I would recommend at least one of the following measures to be implemented by npm:

- Manual inspection of all published packages
- Make publishing require some small financial contribution. Even as little as $1-$5 could prevent mass scale attacks
- Monitor packages which are frequently requested but do not exist - these would be prime typosquatting targets. Reserve these names and prevent them from being registered, unless the developer has a good reason for them to be named this way, and asks for the reservation to be lifted. Similar to the way [js.org](https://js.org) handles [domain requests][ref5].
- Check new package names against already registered ones, compute Levenshtein distance, and forbid registering names which are too similar to existing ones.

The current strategy of just trusting the community and hoping for the best is just a disaster waiting to happen. Too many users readily run any arbitrary code as long as it comes from a package repository and it is way too easy to publish any kind of malicious script there. If action is not taken soon, somebody could develop a sophisticated worm, and combined with [the recently discovered weakness in many users' credentials][ref6], it could spread quickly and grow to the scale of WannaCry.


  [ref1]: https://developers.slashdot.org/story/17/09/16/2030229/pythons-official-repository-included-10-malicious-typo-squatting-modules "Python's Official Repository Included 10 'Malicious' Typo-Squatting Modules"
  [ref2]: http://blog.npmjs.org/post/141702881055/package-install-scripts-vulnerability "Package install scripts vulnerability"
  [ref3]: https://www.npmjs.com/browse/depended "npm"
  [ref4]: https://www.npmjs.com/package/jquey "Security holding package"
  [ref5]: https://github.com/js-org/dns.js.org "dns.js.org"
  [ref6]: https://www.bleepingcomputer.com/news/security/52-percent-of-all-javascript-npm-packages-could-have-been-hacked-via-weak-credentials/ "52% of All JavaScript npm Packages Could Have Been Hacked via Weak Credentials"