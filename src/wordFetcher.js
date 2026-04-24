const fetch = require("node-fetch");
// const DATAMUSE_FULL_APIBASE =
//   "https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?md=sp&sp=s*";
const DATAMUSE_APIBASE =
  "https://cors-anywhere.herokuapp.com/https://api.datamuse.com/words?md=sp&max=250";
//getting a COR local host error will need to debug without this route // change to axios?
// const DATAMUSE_LIMIT_ARG = "&max={}";
// const DATAMUSE_STARTSWITH_ARG = "&sp={}*";
// const LINE_SPACE = "\n";

export default class WordFetcher {
  constructor(word) {
    this.word = word;
    Promise.all([
      (this.followingWords = this.getFollowingWords(word)),
      (this.popularNouns = this.getPopularNouns(word)),
      (this.popularAdjs = this.getPopularAdjs(word)),
      (this.relatedWords = this.getRelatedWords(word)),
      (this.nouns = this.getNouns()),
      (this.verbs = this.getVerbs()),
      (this.adj = this.getAdj()),
      (this.adv = this.getAdv())
    ]).then((results) => {
      const [followingWords, popularNouns, popularAdjs, relatedWords, nouns, verbs, adj, adv ] = results;

      console.log(
        "PROMISE RESULTS",
        "followingWords: ",
        followingWords, '\n',
        "nouns: ",
        nouns, '\n',
        "verbs: ",
        verbs, '\n',
        "adjectives: ",
        adj, '\n',
        "adverbs: ",
        adv, '\n',
        "relatedWords: ",
        relatedWords, '\n',
        "popularNouns: ",
        popularNouns, '\n',
        "popularAdjs: ",
        popularAdjs, '\n'
      );
    });

    // this.associatedWords = this.getAssociatedWords(word);
    // this.synonyms = this.getSynonyms(word);
    // this.kindofWords = this.getKindofWords(word);
    // this.precedingWords = this.getPrecedingWords(word);
    // this.allNouns = this.getAllNouns()
    // this.allVerbs = this.getAllVerbs()
    // // this.allAdj = this.getAllAdj()
    // this.allAdv = this.getAllAdv()
  }

  async requestWords(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getRelatedWords(word) {
    try {
      const relatedWordsUrl = `${DATAMUSE_APIBASE}&ml=${word}`;
      this.relatedWords = await this.requestWords(relatedWordsUrl);
      return this.relatedWords;
    } catch (error) {
      console.log(error);
    }
  }

  async getFollowingWords(word) {
    try {
      this.followingWords = await this.requestWords(
        `${DATAMUSE_APIBASE}&rel_bga=${word}`
      );
      return this.followingWords;
    } catch (error) {
      console.log(error);
    }
  }

  async getPopularNouns(word) {
    try {
      this.popularNouns = await this.requestWords(
        `${DATAMUSE_APIBASE}&rel_jja=${word}`
      );
      return this.popularNouns;
    } catch (error) {
      console.log(error);
    }
  }

  async getPopularAdjs(word) {
    try {
      this.popularAdjs = await this.requestWords(
        `${DATAMUSE_APIBASE}&rel_jjb=${word}`
      );
      return this.popularAdjs;
    } catch (error) {
      console.log(error);
    }
  }

  async getNouns() {
    try {
      const popularNouns = await this.popularNouns
      const relatedNouns = await this.relatedWords
      let nouns;
      nouns = [...popularNouns, ...relatedNouns];
      return nouns;
    } catch (error) {
      console.log("NOT ENOUGH NOUNS!")
      let nouns = [
        {word: "life", numSyllables: 1},
        {word: "joy", numSyllables: 1},
        {word: "magic", numSyllables: 2},
        {word: "happiness", numSyllables: 3},
        {word: "goodness", numSyllables: 2},
        {word: "color", numSyllables: 2},
        {word: "excitement", numSyllables: 3},
        {word: "light", numSyllables: 1},
        {word: "humor", numSyllables: 2},
        {word: "delight", numSyllables: 2},
        {word: "fun", numSyllables: 1},
        {word: "rest", numSyllables: 1},
      ];
      console.log(error);
      return nouns;
    }
  }

  async getVerbs() {
    try {
      const followingWords = await this.followingWords;
      let verbsList = [];
      for (let i in followingWords) {
        if (followingWords[i].tags && followingWords[i].tags.includes("v")) {
          verbsList.push(followingWords[i]);
        }
      }
      console.log("VERBS: ", verbsList)
      if (verbsList.length < 1) {
        console.log("NOT ENOUGH VERBS!")
        verbsList = [
          {word: "am", numSyllables: 1},
          {word: "could", numSyllables: 1},
          {word: "was", numSyllables: 1},
          {word: "is", numSyllables: 1},
          {word: "be", numSyllables: 1},
          {word: "can", numSyllables: 1},
          {word: "will", numSyllables: 1},
          {word: "love", numSyllables: 1},
          {word: "want", numSyllables: 1},
          {word: "take", numSyllables: 1},
          {word: "make", numSyllables: 1},
          {word: "may", numSyllables: 1},
          {word: "must", numSyllables: 1},
          {word: "do", numSyllables: 1},
          {word: "know", numSyllables: 1},
          {word: "find", numSyllables: 1},
          {word: "use", numSyllables: 1},
          {word: "try", numSyllables: 1},
        ];
      }
      return verbsList;
    } catch (error) {
      console.log(error);
    }
  }

  async getAdv() {
    try {
      const followingWords = await this.followingWords;
      let advList = [];
      for (let i in followingWords) {
        if (followingWords[i].tags && followingWords[i].tags.includes("adv")) {
          advList.push(followingWords[i]);
        }
      }
      console.log("ADVERBS: ", advList)
      if (advList.length < 1) {
        console.log("NOT ENOUGH ADVERBS!")
        advList = [
          {word: "cheerfully", numSyllables: 3},
          {word: "happily", numSyllables: 3},
          {word: "warmly", numSyllables: 2},
          {word: "finally", numSyllables: 3},
          {word: "sometimes", numSyllables: 3},
          {word: "slowly", numSyllables: 2},
          {word: "only", numSyllables: 2},
          {word: "always", numSyllables: 2},
          {word: "aha", numSyllables: 2},
          {word: "ahh", numSyllables: 1},
          {word: "OH", numSyllables: 1},
          {word: "DANG", numSyllables: 1},
          {word: "alas", numSyllables: 2},
          {word: "darn", numSyllables: 1},
          {word: "fiddlesticks", numSyllables: 3},
          {word: "golly", numSyllables: 2},
          {word: "EUREKA", numSyllables: 3},
          {word: "UH-OH", numSyllables: 2},
          {word: "shh", numSyllables: 1},
          {word: "WOW", numSyllables: 1},
          {word: "yeah", numSyllables: 1},
          {word: "well", numSyllables: 1},
          {word: "WHOA", numSyllables: 1}
        ]
      }
      return advList;
    } catch (error) {
      console.log(error);
    }
  }

  async getAdj() {
    try {
      const popularAdj = await this.popularAdjs;
      let adjs = popularAdj;
      console.log('ADJS BEFORE IF STMT: ', adjs);
      if (adjs.length < 1) {
        console.log("NOT ENOUGH ADJECTIVES!")
        adjs = [
          {word: "beautiful", numSyllables: 4},
          {word: "fancy", numSyllables: 2},
          {word: "faithful", numSyllables: 2},
          {word: "silly", numSyllables: 2},
          {word: "calm", numSyllables: 1},
          {word: "nice", numSyllables: 1},
          {word: "ARGHH", numSyllables: 1},
          {word: "PSST", numSyllables: 1},
          {word: "POP", numSyllables: 1},
          {word: "POW", numSyllables: 1},
          {word: "BANG", numSyllables: 1},
          {word: "SMASH", numSyllables: 1},
          {word: "THUD", numSyllables: 1}
        ]
      }
      return adjs;
    } catch (error) {
      console.log("NOT ENOUGH ADJECTIVES!")
      let adjs = [
        {word: "beautiful", numSyllables: 4},
        {word: "fancy", numSyllables: 2},
        {word: "faithful", numSyllables: 2},
        {word: "silly", numSyllables: 2},
        {word: "calm", numSyllables: 1},
        {word: "nice", numSyllables: 1},
        {word: "ARGHH", numSyllables: 1},
        {word: "PSST", numSyllables: 1},
        {word: "POP", numSyllables: 1},
        {word: "POW", numSyllables: 1},
        {word: "BANG", numSyllables: 1},
        {word: "SMASH", numSyllables: 1},
        {word: "THUD", numSyllables: 1}
      ]
      console.log(error);
      return adjs;
    }
  }

  // async getAssociatedWords(word) {
  //   this.associatedWords = await this.requestWords(
  //     `${DATAMUSE_APIBASE}&rel_trg=${word}`
  //   );
  //   return this.associatedWords;
  // }

  // async getSynonyms(word) {
  //   this.synonyms = await this.requestWords(
  //     `${DATAMUSE_APIBASE}&rel_syn=${word}`
  //   );
  //   return this.synonyms;
  // }

  // async getKindofWords(word) {
  //   this.kindofWords = await this.requestWords(
  //     `${DATAMUSE_APIBASE}&rel_spc=${word}`
  //   );
  //   return this.kindofWords;
  // }

  // async getPrecedingWords(word) {
  //   this.precedingWords = await this.requestWords(
  //     `${DATAMUSE_APIBASE}&rel_bgb=${word}`
  //   );
  //   return this.precedingWords;
  // }

  //   indirectExtendWordLists(wordType="n") {
  //       let extraWords = []
  //       extraWords.push(this.associatedWords);
  //       extraWords.push(this.synonyms)
  //       extraWords.push(this.kindofWords)
  //       extraWords.push(this.precedingWords)
  //       extraWords.push(this.followingWords)
  //       let indirectWList = []
  //       for (let i in extraWords) {
  //         console.log('WORD IN FOR LOOP: ', extraWords[i])
  //         console.log('TAGS: ', extraWords[i].tags)
  //         // if(extraWords[word]["tags"].includes(wordType)) {
  //             // indirectWList.push(...extraWords[word])
  //         // }
  //       }
  //       console.log("EXTRA WORDS: ", extraWords)
  //       console.log('INDIRECT WORDS: ', indirectWList)
  //       return indirectWList
  //   }

  //   getAllNouns() {
  //       this.nouns.push(this.indirectExtendWordLists("n"));
  //       console.log('THIS.NOUNS: ', this.nouns)
  //       let nounsList = [];
  //       for (let n in this.nouns) {
  //           if(n["word"]) {
  //               nounsList.push(n)
  //           }
  //       }
  //       return nounsList
  //   }

  //   getAllVerbs() {
  //     this.verbs.push(this.indirectExtendWordLists("v"));
  //     let verbsList = [];
  //     for (let v in this.verbs) {
  //         if(v["word"]) {
  //             verbsList.push(v)
  //         }
  //     }
  //     return verbsList
  //     }

  //   getAllAdj() {
  //     this.adj.push(this.indirectExtendWordLists("adj"));
  //     let adjList = [];
  //     for (let adj in this.adj) {
  //         if(adj["word"]) {
  //             adjList.push(adj)
  //         }
  //     }
  //     return adjList
  //   }

  //   getAllAdv() {
  //     if (this.followingWords()) {
  //         let adverb = this.indirectExtendWordLists("adv")
  //         let advList = [];
  //         for (let adv in adverb) {
  //             if(adv["word"]) {
  //                 advList.push(adv)
  //             }
  //         }
  //         console.log("ADV: ", advList)
  //         return advList
  //         }
  //     }
}
