#include <stdlib.h>
#include <stdio.h>
#include <string.h>

#define MAX_URL 101
#define MAX_WORD 1001
#define PUNC_LIST 6

char *normaliseWord(char *word);

int main() {
    // char word[MAX_WORD] = "hello;;;...";
    char word[MAX_WORD] = " url11 url22 url33";
	char out[MAX_WORD];
	sscanf(word, "%s", out);
	printf("%s", out);
	sscanf(word, "%s", out);
	printf("%s", out);
	sscanf(word, "%s", out);
	printf("%s", out);    
    // printf("%s", normaliseWord(word));
    // free(word);
    return 0;
}

// char *normaliseWord(char *word) {
// 	char punc_array[PUNC_LIST] = {'.', ',', ':', ';', '?', '*'};
// 	//Loop through list of punction 
// 	for (int i = 0; i < PUNC_LIST; i++)
// 	{
// 		//If last character matches the list of punctation, normalise the word.
// 		if (word[strlen(word) - 1] == punc_array[i]) {
//             word[strlen(word) - 1] = '\0';
// 			word = normaliseWord(word);
// 		}
// 	}
// 	return word;
// }