/*
Code written by Ezekiel Tay Z5378748 on 12/1/2023
This program is reads data from a given collection of pages in the files collection.txt, 
builds a graph structure using either an adjacency list or adjacency matrix from this data, 
and calculates the PageRank for every URL in the collection
*/
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h> 

#define MAX_URL 101
#define MAX_WORD 1001
#define PUNC_LIST 6

typedef struct page *Page;
typedef struct masternode *Masternode;
typedef struct word *Word;
typedef struct tree *Tree;

struct tree
{
	struct word *root;
};

struct word {
    char *curr_word;
    struct page *page_list;
    struct word *left;
    struct word *right;
};

struct page {
	char *curr_url;
	struct page *next;  
};

struct masternode {
	int num_urls;  // Total count of the number of urls
	struct page *head;  // pointer to head node
	struct page *tail;  // pointer to head node
};

Tree newTree(void);
void freeTree(Word word);
Masternode NewCollection(void);
void CollectionFree(Masternode collection);
Masternode newSortCollection();
Page newPage(void);
void freePage(Page curr_page);
void insertPageInOrder(Masternode collection, char *curr_url);
char *normaliseWord(char *word);
char *lowercase(char *word);
Word newWord(void);
bool treeContains (Word curr_word, char *search_word);
Word treeInsert (Word curr_word, char *search_word, char *curr_url);
void appendToPagelist (Word curr_word, char *curr_url);
void printTree (Word word, FILE *outstream);
void printPagelist (Page curr_page, FILE *outstream);

int main(void) {
    Masternode collection = newSortCollection();
	Tree tree = newTree();
	Page curr_page = collection->head;
	//Loop through sorted list of urls and begin inverted index process
	while (curr_page != NULL)
	{
		//filename is a url + ".txt"
		char filename[MAX_URL + 4];
		strcpy(filename, curr_page->curr_url);
		strcat(filename, ".txt");
		FILE *filestream = fopen(filename, "r");

		//return error if file is empty.
		if (filestream == NULL) {
			perror(filename);
			break;
		}
		
		char temp_str[MAX_WORD];

		//Skip to "Section-2" portion of file
		while (fscanf(filestream, "%s", temp_str) != EOF) {
			if (strcmp(temp_str, "Section-2") == 0) {
				break;
			}
		}

		//Read words in section 2 and either insert to tree or append to tree.
		while (fscanf(filestream, "%s", temp_str) != EOF) {
			if (strcmp(temp_str, "#end") == 0) {
				break;
			}
			normaliseWord(temp_str);

			// If tree already contains word, increase the match count of the word.
			if (treeContains(tree->root, temp_str) == true)
			{
				tree->root = treeInsert(tree->root, temp_str, curr_page->curr_url);
			}
			// Else insert word to the tree.
			else 
			{
				char *str = malloc(MAX_WORD);
				strcpy(str, temp_str);
				tree->root = treeInsert(tree->root, str, curr_page->curr_url);
			}
		}
		curr_page = curr_page->next;
		fclose(filestream);
	}

	//If tree is not empy, write the contents to invertedIndex.txt
	if (tree->root != NULL)
	{
		FILE *outstream = fopen("invertedIndex.txt", "w");
		printTree(tree->root, outstream);
		freeTree(tree->root);
		fclose(outstream);
	}

	free(tree);
	CollectionFree(collection);
	
    return 0;
}

/**
 * Creates a new empty Tree
 */
Tree newTree(void) {
	Tree tree = malloc(sizeof(*tree));
	if (tree == NULL) {
		fprintf(stderr, "couldn't allocate Page\n");
		exit(EXIT_FAILURE);
	}
	tree->root = NULL;
	return tree;
}

/**
 * Clears all data in a tree.
 */
void freeTree(Word word) {
	//If tree is empty to begin with, do nothing
	if (word == NULL)
	{
		return;
	}

	// word links to a left node.
	if (word->left != NULL)
	{
		freeTree(word->left);
	}

	// word links to a right node.
	if (word->right != NULL)
	{
		freeTree(word->right);
	}
	free(word->curr_word);
	freePage(word->page_list);
	free(word);
}

/**
 * Creates a new empty word
 */
Word newWord(void) {
	Word word = malloc(sizeof(*word));
	if (word == NULL) {
		fprintf(stderr, "couldn't allocate Page\n");
		exit(EXIT_FAILURE);
	}
	word->page_list = NULL;
	word->left = NULL;
	word->right = NULL;
	return word;
}

/**
 * Sort the urls in collection in order before rewriting to the collection file.
 */
Masternode newSortCollection() {
    FILE *filestream = fopen("collection.txt", "r");
    char temp_str[MAX_URL];
	//return error if file is empty.
	if (filestream == NULL) {
        perror("collection.txt");
        return NULL;
    }
    
    Masternode collection = NewCollection();
	//Return error if file is empty.
    while (fscanf(filestream, "%s", temp_str) != EOF) {
		char* curr_url = malloc(MAX_URL);
		strcpy(curr_url, temp_str);
		insertPageInOrder(collection, curr_url);
    }
	fclose(filestream);
	return collection;
}

/**
 * Creates a new empty list
 */
Masternode NewCollection(void) {
	Masternode collection = malloc(sizeof(*collection));
	if (collection == NULL) {
		fprintf(stderr, "couldn't allocate Page\n");
		exit(EXIT_FAILURE);
	}
	collection->head = NULL;
	collection->tail = NULL;
	collection->num_urls = 0;
	return collection;
}

/**
 * Frees all resources associated with the given collection
 */
void CollectionFree(Masternode collection) {
	Page curr = collection->head;
	// int count = 1;
	while (curr != NULL) {
		Page temp = curr;
		curr = curr->next;
		free(temp->curr_url);
		free(temp);
	}
	free(collection);
}

/**
 * Creates a new void page.
 */
Page newPage(void) {
	Page q = malloc(sizeof(*q));
	if (q == NULL) {
		fprintf(stderr, "couldn't allocate Page\n");
		exit(EXIT_FAILURE);
	}
	q->next = NULL;
	return q;
}

/**
 * clear the memory of a page/
 */
void freePage(Page curr_page) {
	while (curr_page != NULL)
	{
		Page temp_page = curr_page;
		curr_page = curr_page->next;
		free(temp_page);
	}
}

/**
 * Insert page to a linked list in order.
 */
void insertPageInOrder(Masternode collection, char *curr_url) {
	Page new_page = newPage();
	new_page->curr_url = curr_url;

	//collection is empty
	if (collection->head == NULL)
	{
		collection->head = new_page;
		collection->tail = new_page;
	}

	//Insert to head
	else if (strcmp(curr_url, collection->head->curr_url) <= 0)
	{
		new_page->next = collection->head;
		collection->head = new_page;
	}

	//Insert to tail.
	else if (strcmp(curr_url, collection->tail->curr_url) >= 0)
	{
		collection->tail->next = new_page;
		collection->tail = new_page;
	}

	//Insert in between
	else {
		Page curr_page = collection->head;
		while (strcmp(curr_url, curr_page->next->curr_url) > 0)
		{
			curr_page = curr_page->next;
		}
		new_page->next = curr_page->next;
		curr_page->next = new_page;
	}	
	collection->num_urls += 1;
}

/**
 *	Recursive function to normalise word 
 */
char *normaliseWord(char *word) {
	char punc_array[PUNC_LIST] = {'.', ',', ':', ';', '?', '*'};
	//Loop through list of punction 
	for (int i = 0; i < PUNC_LIST; i++)
	{
		//If last character matches the list of punctation, normalise the word.
		if (word[strlen(word) - 1] == punc_array[i]) {
            word[strlen(word) - 1] = '\0';
			word = normaliseWord(word);
		}
	}
	lowercase(word);
	return word;
}

/**
 *	remover uppsercase letter
 */
char *lowercase(char *word) {
	for (int i = 0; i < strlen(word); i++)
	{
		if(word[i] >= 'A' && word[i] <= 'Z') {
			word[i] = tolower(word[i]);
		}
	}
	return word;
}


/**
 * check if word is in tree
 */
bool treeContains (Word curr_word, char *search_word) {
	if (curr_word == NULL)
	{
		return false;
	}
	if (strcmp(curr_word->curr_word, search_word) < 0)
	{
		return treeContains(curr_word->right, search_word);
	}
	else if (strcmp(curr_word->curr_word, search_word) > 0)
	{
		return treeContains(curr_word->left, search_word);
	}
	else
	{
		return true;
	}
}

/**
 * Insert word if word is not already in tree else increase the count of the matching words
 */
Word treeInsert (Word curr_word, char *search_word, char *curr_url) {
	if (curr_word == NULL)
	{
		Word new_word = newWord();
		new_word->curr_word = search_word;
		appendToPagelist(new_word, curr_url);
		return new_word;
	}
	else if (strcmp(curr_word->curr_word, search_word) < 0)
	{
		curr_word->right = treeInsert(curr_word->right, search_word, curr_url);
	}
	else if (strcmp(curr_word->curr_word, search_word) > 0)
	{
		curr_word->left = treeInsert(curr_word->left, search_word, curr_url);
	}
	else {
		appendToPagelist(curr_word, curr_url);
	}
	return curr_word;	
}

/**
 * Append curr_url to page_list of current word.
 */
void appendToPagelist (Word curr_word, char *curr_url) {
	Page new_page = newPage();
	new_page->curr_url = curr_url;

	//page list is empty.
	if (curr_word->page_list == NULL)
	{
		curr_word->page_list = new_page;
	}

	//Add current url to word pagelist if it is not already inside.
	else {
		Page curr_page = curr_word->page_list;
		Page prev_page = NULL;
		while (curr_page != NULL)
		{
			//Check to prevent duplicate url in pagelist
			if (strcmp(curr_page->curr_url, curr_url) == 0)
			{
				free(new_page);
				return;
			}
			prev_page = curr_page;
			curr_page = curr_page->next;
		}
		prev_page->next = new_page;
	}
}

/**
 * Print out tree in order
 */
void printTree (Word word, FILE *outstream) {
	if (word->left != NULL)
	{
		printTree(word->left, outstream);
	}
	fprintf(outstream, "%s ", word->curr_word);
	printPagelist(word->page_list, outstream);
	if (word->right != NULL)
	{
		printTree(word->right, outstream);
	}
}

/**
 * Print out pagelist in order
 */
void printPagelist (Page curr_page, FILE *outstream) {
	while (curr_page != NULL)
	{
		fprintf(outstream, "%s ", curr_page->curr_url);
		curr_page = curr_page->next;
	}
	fprintf(outstream, "%s", "\n");
}

