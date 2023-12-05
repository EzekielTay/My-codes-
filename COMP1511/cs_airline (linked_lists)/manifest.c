// CS Airline Manifest
// manifest.c
//
// This program was written by Ezekiel Tay (z5378748)
// on 6/4/2022
//
// Version 1.0.0 2022-04-02: Initial Release.
//
// TODO: Manifest of flight


#include "manifest.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct person {
    char name[MAX_NAME_LEN];
    double weight;
    struct person *next;
};

// Internal Function Prototypes
struct person *create_person(char name[MAX_NAME_LEN], double weight);

struct manifest *create_manifest() {
    struct manifest *manifest = malloc(sizeof(struct manifest));
    manifest->people = NULL;
    return manifest;
}



// PROVIDED FUNCTION
// Given person info, mallocs space for the person
// Parameters:
//     name        = name of the new person
//     weight      = weight of the new person
// Returns:
//     pointer to the malloc'd person
struct person *create_person(char name[MAX_NAME_LEN], double weight) {
    // Malloc the new person
    struct person *new_person = malloc(sizeof(struct person));

    // Copy data
    strcpy(new_person->name, name);
    new_person->weight = weight;
    new_person->next = NULL;

    return new_person;
}

void add_person(struct manifest *manifest, char name[MAX_NAME_LEN],
                double weight) {
    // Create a new person
    struct person *new_person = create_person(name, weight);

    // Check if list is empty
    if (manifest->people == NULL) {
        manifest->people = new_person;
        return;
    }

    // Find the end of the list
    struct person *curr = manifest->people;
    while (curr->next != NULL) {
        curr = curr->next;
    }

    // Curr now points to the last person in the list
    // Add the new person to the end of the list
    curr->next = new_person;
}

void print_manifest(struct manifest *manifest) {
    printf("Manifest:\n");

    if (manifest == NULL) {
        return;
    }

    // Loop through list
    struct person *curr = manifest->people;
    while (curr != NULL) {
        printf("    %03.2lf - %s\n", curr->weight, curr->name);
        curr = curr->next;
    }
}

void delete_manifest(struct manifest *manifest) {

    if (manifest == NULL) {
        return;
    }

    // Free the list of people
    struct person *curr = manifest->people;
    while (curr != NULL) {
        struct person *temp = curr->next;
        free(curr);
        curr = temp;
    }

    // Free the malloc
    free(manifest);
}

double manifest_weight(struct manifest *manifest) {

    // TODO: Implement This Function
    double total_weight = 0.00;
    if (manifest->people == NULL)
    {
        return total_weight;
    }
    
    else
    {
        struct person *passenger = manifest->people;
        while (passenger != NULL)
        {
            double weight = passenger->weight;
            total_weight += weight;
            passenger = passenger->next;
        }
    }
    // printf("Current total weight of is: %f\n", total_weight);
    return total_weight;
}

struct manifest *join_manifest(struct manifest *manifest_1, struct manifest *manifest_2) {

    // TODO: Implement This Function
    if (manifest_2 != NULL)
    {
        struct person *passenger_2 = manifest_2->people;
        struct person *passenger_1 = manifest_1->people;
        struct manifest *manifest_to_free = manifest_1;
        while (passenger_2->next != NULL)
        {
            passenger_2 = passenger_2->next;
        }
        passenger_2->next = passenger_1;
        manifest_1->people = NULL;
        delete_manifest(manifest_to_free);
    }

    else
    {
        return manifest_1;
    }
    
    return manifest_2;
}
