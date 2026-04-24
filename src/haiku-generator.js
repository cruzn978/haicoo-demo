import WordFetcher from "./wordFetcher"

export default class HaikuGenerator extends WordFetcher {
  choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

  async buildHaiku() {
    try {
      let haikuSyllables = [5, 7, 5];
      let result = []; // will be a nested arr
      let currWordType = this.choose(["adj", "n", "v"]);
      let structureMap = {
        n: { next: "v", wordList: await this.nouns },
        v: {
          next: this.choose(["adv", "adj"]),
          wordList: await this.verbs,
        },
        adj: {
          next: "n",
          wordList: await this.adj,
        },
        adv: {
          next: this.choose(["adj", "n"]),
          wordList: await this.adv,
        },
      };
      let usedWords = [];
      for (let syllableCount of haikuSyllables) {
        let syllableTarget = syllableCount; // syllableTarget will get decremented
        let currLine = [];
        let errCount = 0;
        let counter = 0;
        while (syllableTarget > 0 && counter < 30) {
          if (counter === 29) {
            console.log("I AM GOING TO TAKE YOU OUT OF THIS INFINITE LOOP ;)");
          }
          counter++;
          errCount += 1;
          let currWords = []; // currWords stores every possible word
          for (let word of structureMap[currWordType].wordList) {
            if (word.numSyllables && word["numSyllables"] <= syllableTarget) {
              currWords.push(word);
            }
          }
          let wordToAdd = this.choose(currWords); // choose random possible word in array
          if (
            wordToAdd &&
            usedWords.includes(wordToAdd["word"]) &&
            errCount < 5
          ) {
            continue;
          } else if (wordToAdd) {
            usedWords.push(wordToAdd["word"]);
            currLine.push(wordToAdd["word"]);
            syllableTarget -= wordToAdd["numSyllables"];
          }
          currWordType = structureMap[currWordType].next;
        }
        result.push(currLine);
      }

      return result;
      // `${result[0].join(" ")}\n${result[1].join(" ")}\n${result[2].join(
      //   " "
      // )}`;
    } catch (error) {
      console.log(error);
    }
  }
}
