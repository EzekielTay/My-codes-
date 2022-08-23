////////////////////////////////////////////////////////////////////////
// COMP1521 22T2 --- Assignment 2: `bytelocker', a simple file encryptor
// <https://www.cse.unsw.edu.au/~cs1521/22T2/assignments/ass2/index.html>
//
// Written by Ezekiel Tay (z5378748) on 20/7/2022.
//
// 2022-07-22   v1.2    Team COMP1521 <cs1521 at cse.unsw.edu.au>

//Bytelocker program is a simple file encrypter project for students 
//to practice file operations and bitwise operations. 

#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <stdint.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>
#include <dirent.h>

#include "bytelocker.h"

// ADD ANY EXTRA #defines HERE

#define FALSE 0
#define TRUE 1
#define MAX_ROTATE 8

char *generate_random_string(int seed);
void sort_by_count(struct text_find *files, size_t n);
void sort_by_name(char *filenames[], size_t num_files);

// ADD YOUR FUNCTION PROTOTYPES HERE
void print_mode_field (unsigned int file_mode, unsigned int target_field);
void print_all_file_perms(unsigned int file_mode);
int file_perm_check (unsigned int file_mode, unsigned int target_field);
void traverse_directory(char text[MAX_SEARCH_LENGTH], struct text_find struct_array[MAX_LINE_LEN]);
struct text_find copy_filedata(char filename[MAX_PATH_LEN], char text[MAX_SEARCH_LENGTH]);
void append_to_struct_array(char pathname[MAX_PATH_LEN], char text[MAX_SEARCH_LENGTH], 
                                        struct text_find struct_array[MAX_LINE_LEN]);
int count_match_in_string(char string[MAX_LINE_LEN], char to_compare[MAX_SEARCH_LENGTH], 
                                                                    int match_word_count);
void print_files_search(char filename[MAX_SEARCH_LENGTH], int len_base_dir);
void make_filesize_16 (char filename[MAX_PATH_LEN]);
void xor_file_text(char *filetext, char *ptr_random_vector);

// Some provided strings which you may find useful. Do not modify.
const char *const MSG_ERROR_FILE_STAT  = "Could not stat file\n";
const char *const MSG_ERROR_FILE_OPEN  = "Could not open file\n";
const char *const MSG_ERROR_CHANGE_DIR = "Could not change directory\n";
const char *const MSG_ERROR_DIRECTORY  =
    "%s cannot be encrypted: bytelocker does not support encrypting directories.\n";
const char *const MSG_ERROR_READ       =
    "%s cannot be encrypted: group does not have permission to read this file.\n";
const char *const MSG_ERROR_WRITE      =
    "%s cannot be encrypted: group does not have permission to write here.\n";
const char *const MSG_ERROR_SEARCH     = "Please enter a search string.\n";
const char *const MSG_ERROR_RESERVED   =
    "'.' and '..' are reserved filenames, please search for something else.\n";


//////////////////////////////////////////////
//                                          //
//              SUBSET 0                    //
//                                          //
//////////////////////////////////////////////

//  Read the file permissions of the current directory and print them to stdout.
void show_perms(char filename[MAX_PATH_LEN]) {
    struct stat object;
    if (stat(filename, &object) != 0)
    {
        printf(MSG_ERROR_FILE_STAT);
        return;
    }

    printf("%s: ", filename);
    print_all_file_perms(object.st_mode);
    printf("\n");
}

//  Prints current working directory to stdout.
void print_current_directory(void) {
    char pathname[MAX_PATH_LEN];
    if (getcwd(pathname, sizeof pathname) == NULL) {
        perror(pathname);
    }
    else
    {
        printf("Current directory is: %s\n", pathname);
    }
}

//  Changes directory to the given path.
void change_directory(char dest_directory[MAX_PATH_LEN]) {
    if (strcmp(dest_directory, "~") == 0)
    {
        chdir(getenv("HOME"));
        printf("Moving to %s\n", getenv("HOME"));
        return;
    }
    
    if (chdir(dest_directory) != 0)
    {
        printf("%s", MSG_ERROR_CHANGE_DIR);
        return;
    }
    else
    {
        printf("Moving to %s\n", dest_directory);
    }
}

//  Lists the contents of the current directory to stdout.
void list_current_directory(void) {
    char pathname[MAX_PATH_LEN];
    getcwd(pathname, sizeof pathname); 
    DIR *dirp = opendir(pathname);
    
    struct dirent *curr_name;
 
    char *array_filenames[MAX_LINE_LEN] = {"0"};
    int count = 0;

    // Store the files in directory into an array.
    while ((curr_name = readdir(dirp)) != NULL) 
    {
        array_filenames[count] = curr_name->d_name;
        count += 1;
    }

    //Sort the array.
    sort_by_name(array_filenames, count);   

    //Print the permissions & filenames
    for (int i = 0; i < count; i++)     
    {
        struct stat object;
        stat(array_filenames[i], &object);
        print_all_file_perms(object.st_mode);
        printf("\t");
        printf("%s\n", array_filenames[i]);
    }
    closedir(dirp);
}

//Print all permisions of a filename
void print_all_file_perms(unsigned int file_mode)
{
    print_mode_field(file_mode, __S_IFREG); // Check if filename is reg file
    print_mode_field(file_mode, __S_IFDIR); // Check if filename is dir.
    print_mode_field(file_mode, S_IRUSR); // Check owner has read perm
    print_mode_field(file_mode, S_IWUSR); // Check owner has write perm
    print_mode_field(file_mode, S_IXUSR); // Check owner has execute perm
    print_mode_field(file_mode, S_IRGRP); // Check grp has read perm
    print_mode_field(file_mode, S_IWGRP); // Check grp has write perm
    print_mode_field(file_mode, S_IXGRP); // Check grp has execute perm
    print_mode_field(file_mode, S_IROTH); // Check OTH has read perm
    print_mode_field(file_mode, S_IWOTH); // Check OTH has write perm
    print_mode_field(file_mode, S_IXOTH); // Check OTH has execute perm
}

//Bitwise operation code to determine & print filename permissions.
void print_mode_field (unsigned int file_mode, uint32_t target_field)
{
    uint32_t number_string = file_mode;
    number_string = number_string | target_field;  
    if (number_string == file_mode) // indicate bit was '1' in that position.
    {
        if (target_field == __S_IFREG)
        {
            printf("-");
        }

        if (target_field == __S_IFDIR)
        {
            printf("d");
        }

        if (target_field == S_IRUSR || target_field == S_IRGRP || target_field == S_IROTH)
        {
            printf("r");
        }

        if (target_field == S_IWUSR || target_field == S_IWGRP || target_field == S_IWOTH)
        {
            printf("w");
        }
        
        if (target_field == S_IXUSR || target_field == S_IXGRP || target_field == S_IXOTH)
        {
            printf("x");
        }
    }
    else    //Bit in that position flipped suggest '1' was not there previously.
    {
        if (target_field != __S_IFDIR && target_field != __S_IFREG)
        {
            printf("-");
        }
    }
}

//////////////////////////////////////////////
//                                          //
//              SUBSET 1                    //
//                                          //
//////////////////////////////////////////////
//Test if file can be encrypted.
bool test_can_encrypt(char filename[MAX_PATH_LEN]) {
    struct stat object;
    if (stat(filename, &object) != 0) //Check if filename exist.
    {
        printf(MSG_ERROR_FILE_STAT);
        return FALSE;
    }
    
    int file_valid_flag;
    file_valid_flag = file_perm_check(object.st_mode, __S_IFREG); //Check if regular file.
    if (file_valid_flag == FALSE)
    {
        printf(MSG_ERROR_DIRECTORY, filename);
        return FALSE;
    }

    file_valid_flag = file_perm_check(object.st_mode, S_IRGRP); //Check if GRP can read.
    if (file_valid_flag == FALSE)
    {
        printf(MSG_ERROR_READ, filename);
        return FALSE;
    }

    file_valid_flag = file_perm_check(object.st_mode, S_IWGRP); // Check if GRP can write.
    if (file_valid_flag == FALSE)
    {
        printf(MSG_ERROR_WRITE, filename);
        return FALSE;
    }

    return TRUE;
}

//Check file permissions by using bitwise operations.
int file_perm_check (unsigned int file_mode, unsigned int target_field)
{
    uint32_t number_string = file_mode;
    number_string = number_string | target_field;  
    if (number_string == file_mode) // indicate bit was '1' in that position.
    {
        return TRUE;
    }
    else
    {
        return FALSE;
    }
}

//simple_xor_encryption.
void simple_xor_encryption(char filename[MAX_PATH_LEN]) {
    if (!test_can_encrypt(filename)) return;
   
    FILE *input_stream = fopen(filename, "r");  //Open file to copy from
    if (input_stream == NULL) {
        perror(filename);
        return;
    }
    
    char add_file[MAX_PATH_LEN] = ".xor";
    char new_filename[MAX_PATH_LEN];
    strcpy(new_filename, filename);
    strcat(new_filename, add_file);

    FILE *output_stream = fopen(new_filename, "w"); //Open file to copy to.
    if (output_stream == NULL) {
        perror(new_filename);
        return;
    }

    int content;
    while ((content = fgetc(input_stream)) != EOF)  // Copy the bytes to new_file.
    {
        content = content ^ 0b11111111;
        fputc(content, output_stream);
    }
    

    fclose(input_stream);
    fclose(output_stream);    
}

//simple_xor_decryption.
void simple_xor_decryption(char filename[MAX_PATH_LEN]) {
    if (!test_can_encrypt(filename)) return;

    FILE *input_stream = fopen(filename, "r");
    if (input_stream == NULL) {
        perror(filename);
        return;
    }

    char new_filename[MAX_PATH_LEN];
    strcpy(new_filename, filename);
    char add_name[MAX_PATH_LEN] = ".dec";
    strcat(new_filename, add_name);

    FILE *output_stream = fopen(new_filename, "w");
    if (output_stream == NULL) {
        perror(new_filename);
        return;
    }

    int content;
    while ((content = fgetc(input_stream)) != EOF)  // Copy the bytes to new_file.
    {
        content = content ^ 0b11111111;
        fputc(content, output_stream);
    }
    
    fclose(input_stream);
    fclose(output_stream); 
}


//////////////////////////////////////////////
//                                          //
//              SUBSET 2                    //
//                                          //
//////////////////////////////////////////////

//search all directories for specified filename.
void search_by_filename(char filename[MAX_SEARCH_LENGTH]) {
    if (filename == NULL)
    {
        printf(MSG_ERROR_SEARCH);
        return;
    }
    
    if (strcmp(filename, ".") == 0 || strcmp(filename, "..") == 0)
    {
        printf(MSG_ERROR_RESERVED);
        return;
    }
    char base_directory[MAX_PATH_LEN];
    getcwd(base_directory, sizeof base_directory);
    int len_base_dir = strlen(base_directory);
    print_files_search(filename, len_base_dir);   
}

//Print all filenames which contain user input search characters 
void print_files_search(char filename[MAX_SEARCH_LENGTH], int len_base_dir)
{
    char pathname[MAX_PATH_LEN];
    getcwd(pathname, sizeof pathname); 
    DIR *dirp = opendir(pathname);
    struct dirent *curr_name;

    char *array_filenames[MAX_LINE_LEN] = {"0"};
    int count = 0;
    
    // Store the files in directory into an array.
    while ((curr_name = readdir(dirp)) != NULL) 
    {
        array_filenames[count] = curr_name->d_name;
        count += 1;
    }
    
    //Sort the array.
    sort_by_name(array_filenames, count);  

    for (int i = 0; i < count; i++)
    {
        struct stat object_file;
        stat(array_filenames[i], &object_file);
        if (strcmp(array_filenames[i], ".") != 0 && strcmp(array_filenames[i], "..") != 0)
        {
            //If array_element contains search characters, print filename
            if (strstr(array_filenames[i], filename))
            {
                char curr_directory[MAX_PATH_LEN];
                getcwd(curr_directory, sizeof(curr_directory));

                char copy_string[MAX_PATH_LEN] = "";
                strcpy(copy_string, curr_directory);
                strcat(copy_string, "/");
                strcat(copy_string, array_filenames[i]);

                char to_print_string[MAX_PATH_LEN] = "";
                int string_index = 0;
                for (int j = len_base_dir; j < strlen(copy_string); j++)
                {
                    to_print_string[string_index] = copy_string[j];
                    string_index += 1;
                }
                
                print_all_file_perms(object_file.st_mode);
                printf("\t");
                printf(".%s\n", to_print_string);
            }

            //Test if file is directory.
            unsigned int test_for_dir = object_file.st_mode | __S_IFDIR; 

            //if current file is a directory.
            if (object_file.st_mode == test_for_dir) 
            {   
                char new_directory[MAX_PATH_LEN] = "";
                strcpy(new_directory, array_filenames[i]);
                chdir(new_directory);
                print_files_search(filename, len_base_dir);
                chdir("..");
            }
        }
    }
}

//search all files in all directories for specified text in file.
void search_by_text(char text[MAX_SEARCH_LENGTH]) {
    if (text == NULL)
    {
        printf(MSG_ERROR_SEARCH);
        return;
    }

    struct text_find struct_array[MAX_LINE_LEN];
    for (int i = 0; i < MAX_LINE_LEN; i++)
    {
        struct_array[i].count = 0;
    }
    
    traverse_directory(text, struct_array);

    int array_counter = 0;
    while (struct_array[array_counter].count != 0)
    {
        array_counter += 1;
    }
    
    sort_by_count(struct_array, array_counter);  
    char curr_directory[MAX_PATH_LEN];
    getcwd(curr_directory, sizeof(curr_directory));
    int cut_string = strlen(curr_directory);

    for (int i = 0; i < array_counter; i++) //Remove parent director from name of file.
    {
        if (struct_array[i].count != 0)
        {
            char new_pathname[MAX_PATH_LEN] = "";
            int count = 0;
            for (int j = cut_string; j < strlen(struct_array[i].path); j++)
            {
                new_pathname[count] = struct_array[i].path[j];
                count += 1; 
            }
            strcpy(struct_array[i].path, new_pathname);
        }
    }
    

    for (int i = 0; i < array_counter; i++)
    {
        if (struct_array[i].count != 0)
        {
            printf("%d:\t.%s\n", struct_array[i].count, struct_array[i].path); 
        }
    }
}

//Traverse the entire directory tree.
void traverse_directory(char text[MAX_SEARCH_LENGTH], 
        struct text_find struct_array[MAX_LINE_LEN])
{
    char pathname[MAX_PATH_LEN];
    getcwd(pathname, sizeof pathname); 
    DIR *dirp = opendir(pathname);
    struct dirent *curr_name;

    // Store the name of files in directory into an array.
    while ((curr_name = readdir(dirp)) != NULL) 
    {
        struct stat object;
        stat(curr_name->d_name, &object);

        if (strcmp(curr_name->d_name, ".") != 0 && strcmp(curr_name->d_name, "..") != 0)
        {
            //Test if file is directory.
            unsigned int test_number_dir = object.st_mode | __S_IFDIR; 
            unsigned int test_number_file = object.st_mode | __S_IFREG;

            //if current file is a directory.
            if (object.st_mode == test_number_dir) 
            {   
                chdir(curr_name->d_name);                 
                traverse_directory(text, struct_array);
                chdir("..");
            }

            //if current file is a file.
            else if (object.st_mode == test_number_file) 
            {
                append_to_struct_array(curr_name->d_name, text, struct_array);
            }
        }
    }
}

//append file to struct array.
void append_to_struct_array(char pathname[MAX_PATH_LEN], char text[MAX_SEARCH_LENGTH], 
                                            struct text_find struct_array[MAX_LINE_LEN])
{
    struct stat current_file;
    stat(pathname, &current_file);
    int is_text_file_flag = file_perm_check(current_file.st_mode, __S_IFREG);
    if (is_text_file_flag == TRUE)
    {          
        FILE *input_stream = fopen(pathname, "r");
        if (input_stream != NULL) 
        {
            int array_index = 0;
            while (struct_array[array_index].count != 0)
            {
                array_index += 1;
            }      
            struct_array[array_index] = copy_filedata(pathname, text);
        }
    }
}

//Create struct text find to contain file pathname and number of matches.
struct text_find copy_filedata(char filename[MAX_PATH_LEN], char text[MAX_SEARCH_LENGTH])
{
    struct text_find object;
    char directory_name[MAX_PATH_LEN];
    getcwd(directory_name, sizeof(directory_name));
    strcat(directory_name, "/");
    strcat(directory_name, filename);
    strcpy(object.path, directory_name);
    
    FILE *input_stream = fopen(filename, "r");
    fseek(input_stream, 0, SEEK_END);
    long n_bytes = ftell(input_stream);
    fseek(input_stream, 0, SEEK_SET);

    char string[MAX_LINE_LEN] = "";
    int content;
    int index = 0;
    int match_word_count = 0;
    
    for (int i = 0; i < n_bytes; i++)
    {
        content = fgetc(input_stream);
        string[index] = content;
        index += 1;

        if (index >= MAX_LINE_LEN - 2)
        {
            string[MAX_LINE_LEN - 1] = '\0';

            //add match count
            match_word_count = count_match_in_string(string, text, match_word_count); 
    
            // printf("EMPTY STRING?!\n");
            for (int j = 0; j < strlen(string); j++)
            {
                string[j] = ' ';
            }
            index = 0;
        }
    }
    match_word_count = count_match_in_string(string, text, match_word_count);
    object.count = match_word_count; 
    fclose(input_stream);
    return object;
}

//Determine number of word match in a file.
int count_match_in_string(char string[MAX_LINE_LEN], char to_compare[MAX_SEARCH_LENGTH], 
                                                                int match_word_count)
{
    int match_flag = TRUE;
    int end = strlen(string) - strlen(to_compare) + 1;
    for (int i = 0; i < end; i++)
    {
        for (int j = 0; j < strlen(to_compare); j++)
        {
            if (to_compare[j] != string[i + j])
            {
                match_flag = FALSE;
                break;
            }
        }

        if (match_flag == TRUE)
        {
            match_word_count += 1;
        }
        match_flag = TRUE;        
    }
    
    return match_word_count;
}


//////////////////////////////////////////////
//                                          //
//              SUBSET 3                    //
//                                          //
//////////////////////////////////////////////
//Encrypt a file with electronic_codebook_encryption
void electronic_codebook_encryption(char filename[MAX_PATH_LEN], 
                            char password[CIPHER_BLOCK_SIZE + 1]) 
{
    if (!test_can_encrypt(filename)) return;
    make_filesize_16(filename);
    FILE *input_stream = fopen(filename, "r");
    if (input_stream == NULL)
    {
        perror(filename);
        return;
    }
    
    fseek(input_stream, 0, SEEK_END);
    long n_bytes = ftell(input_stream);

    //Quotient determine number of loops
    long quotient = n_bytes / 16; 
    fseek(input_stream, 0, SEEK_SET);

    char plaintext[CIPHER_BLOCK_SIZE + 1] = "";
    char *receive;
    char new_filename[MAX_PATH_LEN] = "";
    strcpy(new_filename, filename);
    strcat(new_filename, ".ecb");

    FILE *output_stream = fopen(new_filename, "w");
    
    //Loop through entire file via intervals of 16 bytes.
    for (long i = 0; i < quotient; i++)
    {
        fread(plaintext, 1, CIPHER_BLOCK_SIZE, input_stream);
        receive = shift_encrypt(plaintext, password);
        fwrite(receive, 1, CIPHER_BLOCK_SIZE, output_stream);
    }
    fclose(input_stream);
    fclose(output_stream);
    return;
}

//Decrypt a file with electronic_codebook_decryption
void electronic_codebook_decryption(char filename[MAX_PATH_LEN], 
                        char password[CIPHER_BLOCK_SIZE + 1]) {
    if (!test_can_encrypt(filename)) return;
    make_filesize_16(filename);

    FILE *input_stream = fopen(filename, "r");
    if (input_stream == NULL)
    {
        perror(filename);
        return;
    }
    
    fseek(input_stream, 0, SEEK_END);
    long n_bytes = ftell(input_stream);

    //Quotient determine number of loops
    long quotient = n_bytes / 16; 
    fseek(input_stream, 0, SEEK_SET);

    char ciphertext[CIPHER_BLOCK_SIZE + 1] = "";
    char *receive;
    char new_filename[MAX_PATH_LEN] = "";
    strcpy(new_filename, filename);
    strcat(new_filename, ".dec");

    FILE *output_stream = fopen(new_filename, "w");

    //Loop through entire file via intervals of 16 bytes.
    for (long i = 0; i < quotient; i++)
    {
        fread(ciphertext, 1, CIPHER_BLOCK_SIZE, input_stream);
        receive = shift_decrypt(ciphertext, password);
        fwrite(receive, 1, CIPHER_BLOCK_SIZE, output_stream);
    }
    fclose(input_stream);
    fclose(output_stream);
    return;
}

//Encrypt 16 bytes of data with electronic_codebook_encryption
char *shift_encrypt(char *plaintext, char *password) 
{
    for (int i = 0; i < CIPHER_BLOCK_SIZE; i++)
    {
        char new_byte;
        uint8_t bits = plaintext[i];
        int n_rotations = password[i];
        if (n_rotations >= MAX_ROTATE)
        {
            n_rotations = n_rotations % MAX_ROTATE;
        }
        uint8_t new_msb = bits << n_rotations;
        uint8_t new_lsb = bits >> (MAX_ROTATE - n_rotations);
        new_byte = new_lsb | new_msb;
        plaintext[i] = new_byte;
    }
    return plaintext;
}

//Decrypt 16 bytes of data with electronic_codebook_decryption
char *shift_decrypt(char *ciphertext, char *password) {
    for (int i = 0; i < CIPHER_BLOCK_SIZE; i++)
    {
        char new_byte;
        uint8_t bits = ciphertext[i];
        int n_rotations = password[i];
        if (n_rotations >= MAX_ROTATE)
        {
            n_rotations = n_rotations % MAX_ROTATE;
        }
        uint8_t new_lsb = bits >> n_rotations;
        uint8_t new_msb = bits << (MAX_ROTATE - n_rotations);
        new_byte = new_lsb | new_msb;
        ciphertext[i] = new_byte;
    }
    return ciphertext;
}

//If file_size not a multiple of 16, append NULL characters at end till it 16.
void make_filesize_16 (char filename[MAX_PATH_LEN])
{
    FILE *input_stream = fopen(filename, "r");
    if (input_stream == NULL)
    {
        perror(filename);
        return;
    }

    fseek(input_stream, 0, SEEK_END);
    long n_bytes = ftell(input_stream);

    //Determine offset of bytes to multiple of 16
    int remainder = n_bytes % 16; 
    if (remainder != 0)
    {
        remainder = 16 - remainder;
    }

    fclose(input_stream);

    if (remainder != 0)
    {
        FILE *append_stream = fopen(filename, "a");
        for (int i = 0; i < remainder; i++)
        {
            fputc(0, append_stream);
        }
        fclose(append_stream);
    }
    return;
}

//////////////////////////////////////////////
//                                          //
//              SUBSET 4                    //
//                                          //
//////////////////////////////////////////////

//Cyclic_block_shift_encryption
void cyclic_block_shift_encryption(char filename[MAX_PATH_LEN], 
                        char password[CIPHER_BLOCK_SIZE + 1]) {
    if (!test_can_encrypt(filename)) return;
    make_filesize_16(filename);
    //Generate random initialisation vector
    char *ptr_random_vector = generate_random_string(1);
    
    FILE *input_stream = fopen(filename, "r");
    if (input_stream == NULL)
    {
        perror(filename);
        return;
    }
    
    fseek(input_stream, 0, SEEK_END);
    long n_bytes = ftell(input_stream);

    //Quotient determine number of loops
    long quotient = n_bytes / 16; 
    fseek(input_stream, 0, SEEK_SET);

    char filetext[CIPHER_BLOCK_SIZE + 1] = "";
    char new_filename[MAX_PATH_LEN] = "";
    strcpy(new_filename, filename);
    strcat(new_filename, ".cbc");

    FILE *output_stream = fopen(new_filename, "w");
    
    //Loop through entire file via intervals of 16 bytes.
    for (long i = 0; i < quotient; i++)
    {
        fread(filetext, 1, CIPHER_BLOCK_SIZE, input_stream);
        xor_file_text(filetext, ptr_random_vector);
        ptr_random_vector = shift_encrypt(ptr_random_vector, password);
        fwrite(ptr_random_vector, 1, CIPHER_BLOCK_SIZE, output_stream);
    }

    fclose(input_stream);
    fclose(output_stream);
    return;
}

//Cyclic_block_shift_decryption
void cyclic_block_shift_decryption(char filename[MAX_PATH_LEN], 
                        char password[CIPHER_BLOCK_SIZE + 1]) {
    if (!test_can_encrypt(filename)) return;
    make_filesize_16(filename);
    //Generate random initialisation vector
    char *ptr_random_vector = generate_random_string(1);
    FILE *input_stream = fopen(filename, "r");
    if (input_stream == NULL)
    {
        perror(filename);
        return;
    }
    
    fseek(input_stream, 0, SEEK_END);
    long n_bytes = ftell(input_stream);

    //Quotient determine number of loops
    long quotient = n_bytes / 16; 
    fseek(input_stream, 0, SEEK_SET);

    char filetext[CIPHER_BLOCK_SIZE + 1] = "";
    char new_filename[MAX_PATH_LEN] = "";

    strcpy(new_filename, filename);
    strcat(new_filename, ".dec");

    FILE *output_stream = fopen(new_filename, "w");
    
    //Loop through entire file via intervals of 16 bytes.
    for (long i = 0; i < quotient; i++)
    {
        fread(filetext, 1, CIPHER_BLOCK_SIZE, input_stream);        
        char *ptr_filetext = shift_decrypt(filetext, password);
        xor_file_text(ptr_filetext, ptr_random_vector);  
        fwrite(ptr_random_vector, 1, CIPHER_BLOCK_SIZE, output_stream);

        fseek(input_stream, - CIPHER_BLOCK_SIZE, SEEK_CUR);
        //Store current 16 ciphertext as next initialisation vector.
        for (int j = 0; j < CIPHER_BLOCK_SIZE; j++)
        {
            ptr_random_vector[j] = fgetc(input_stream);
        }
    }   
    fclose(input_stream);
    fclose(output_stream);
}

void xor_file_text(char *string_same, char *string_to_change)
{
    for (int i = 0; i < CIPHER_BLOCK_SIZE; i++)
    {
        string_to_change[i] = (string_same[i] ^ string_to_change[i]);
    }
}


// PROVIDED FUNCTIONS, DO NOT MODIFY

// Generates a random string of length RAND_STR_LEN.
// Requires a seed for the random number generator.
// The same seed will always generate the same string.
// The string contains only lowercase + uppercase letters,
// and digits 0 through 9.
// The string is returned in heap-allocated memory,
// and must be freed by the caller.
char *generate_random_string(int seed) {
    if (seed != 0) {
        srand(seed);
    }

    char *alpha_num_str =
            "abcdefghijklmnopqrstuvwxyz"
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            "0123456789";

    char *random_str = malloc(RAND_STR_LEN);

    for (int i = 0; i < RAND_STR_LEN; i++) {
        random_str[i] = alpha_num_str[rand() % (strlen(alpha_num_str) - 1)];
    }

    return random_str;
}

// Sorts the given array (in-place) of files with
// associated counts into descending order of counts.
// You must provide the size of the array as argument `n`.
void sort_by_count(struct text_find *files, size_t n) {
    if (n == 0 || n == 1) return;
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (files[j].count < files[j + 1].count) {
                struct text_find temp = files[j];
                files[j] = files[j + 1];
                files[j + 1] = temp;
            } else if (files[j].count == files[j + 1].count && strcmp(files[j].path, files[j + 1].path) > 0) {
                struct text_find temp = files[j];
                files[j] = files[j + 1];
                files[j + 1] = temp;
            }
        }
    }
}

// Sorts the given array (in-place) of strings alphabetically.
// You must provide the size of the array as argument `n`.
void sort_by_name(char *filenames[], size_t num_filenames) {
    if (num_filenames == 0 || num_filenames == 1) return;
    for (int i = 0; i < num_filenames - 1; i++) {
        for (int j = 0; j < num_filenames - i - 1; j++) {
            if (strcmp(filenames[j], filenames[j + 1]) > 0) {
                char *temp = filenames[j];
                filenames[j] = filenames[j + 1];
                filenames[j + 1] = temp;
            }
        }
    }
}

// ADD YOUR FUNCTION DEFINITIONS HERE
