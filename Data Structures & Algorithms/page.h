// Interface to the Page ADT

// !!! DO NOT MODIFY THIS FILE !!!

#ifndef Page_H
#define Page_H
#include <stdbool.h>
#include <stdio.h>

typedef char *Item;
typedef struct page *Page;

/**
 * Creates a new empty page
 */
Page PageNew(void);

/**
 * Frees all resources associated with the given Page
 */
void PageFree(Page q);

/**
 * Adds an item to the end of the Page
 */
void PageEnqueue(Page q, Item it);

/**
 * Removes an item from the front of the Page and returns it
 * Assumes that the Page is not empty
 */
Item PageDequeue(Page q);

/**
 * Gets the item at the front of the Page without removing it
 * Assumes that the Page is not empty
 */
Item PageFront(Page q);

/**
 * Gets the size of the given Page
 */
int PageSize(Page q);

/**
 * Returns true if the Page is empty, and false otherwise
 */
bool PageIsEmpty(Page q);

/**
 * Prints the Page to the given file with items space-separated
 */
void PageDump(Page q, FILE *fp);

/**
 * Prints out information for debugging
 */
void PageDebugPrint(Page q);

#endif

