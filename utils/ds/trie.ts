class TrieNode {
  children: { [key: string]: TrieNode };
  isWord: boolean;

  constructor() {
    this.children = {};
    this.isWord = false;
  }
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isWord = true;
  }

  search(word: string) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      const char = word.charAt(i);
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isWord;
  }
}