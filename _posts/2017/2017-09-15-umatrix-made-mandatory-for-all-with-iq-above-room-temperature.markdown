---
layout: "post"
title: "uMatrix made mandatory for all with IQ above room temperature"
date: "2017-09-15 16:33"
tags: news browsers crypto
image: "https://addons.cdn.mozilla.net/user-media/previews/full/158/158458.png"
summary: "Embeddable JS cryptominer must be the last straw for the remaining people who still aren't blocking JS by default, right?"
---

[Show HN: Embeddable JavaScript Crypto Miner][9ee8d245]

This happened yesterday, and I predicted it will lead to chinese malware sites mining bitcoins instead of installing viruses. Why install malware when you can already execute arbitrary code on most computers connecting to your site via Javascript? Obviously we didn't even have to wait a full 24h before this happened:

[First Ever Malvertising Campaign Uses JavaScript To Mine Cryptocurrencies In Your Browser][33576be8]

It's official now: only the mentally deficient won't block all JS by default. Demanding JS execution on your computer must be treated like demanding to consciously submit to an arbitrary code execution exploit until proven otherwise. We need a platform like [Decentraleyes][a08bcf5a] to allow us to easily run local, auditable copies of common scripts and block everything else we cannot inspect.

Remember to always install uMatrix on all your browsers and block all JS by default, using a whitelist of websites you trust.

[uMatrix Github project page][edd0c259]

  [9ee8d245]: https://news.ycombinator.com/item?id=15246145 "Show HN: Embeddable JavaScript Crypto Miner"
  [33576be8]: https://developers.slashdot.org/story/17/09/14/2137230/first-ever-malvertising-campaign-uses-javascript-to-mine-cryptocurrencies-in-your-browser "First Ever Malvertising Campaign Uses JavaScript To Mine Cryptocurrencies In Your Browser"
  [a08bcf5a]: https://decentraleyes.org/ "Decentraleyes"
  [edd0c259]: https://github.com/gorhill/uMatrix "uMatrix Github project page"
