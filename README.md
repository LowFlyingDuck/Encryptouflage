# Encryption
 This is a module, that can encrypt and decrypt messsages. (API Integration)

## About
 With this module you can encrypt and decrypt any text message. This might be useful for encrypting Emails or Files in order to prevent third parties from monitoring the matter.
 
 By default, the encrypted message is output in "lettered" format, camouflaging the message to automated email filters.
 If the message is not encryted in a "lettered" format, the initialization vector, which is returned by the `encrypt()` function, has to be saved and used again in the `decrypt()` function.

## Usage
 