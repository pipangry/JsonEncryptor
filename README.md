# Json-UI Obfuscator & Encryptor
Poweful Json-UI obfuscator. Supports key encryption, content clogging and multi file processing.
# A short tutorial
First, read the documentation on using the obfuscator. I advise you to use obfuscation of everything at once .zip archive, which allows you to use additional obfuscation functions and facilitate the obfuscation of your pack. Look at your code for third-party annotations or variables, and add them to the exceptions. To check the correct syntax encryption, you can disable content clogging.

# Documentation
Welcome to monotonous text!
Here you can read about:
* What does this obfuscator do
* How your syntax will encrypt
* Obfuscation settings
* Exceptions manager

## What does this obfuscator do?
You can upload a file in the following format to this obfuscator .zip or .json.
The obfuscator makes your code difficult to read and difficult to modify, while maintaining its correct operation (if you use it correctly, of course).

If you import the .zip file:
> First, the obfuscator searches for the ui folder, and works only with it, processing all files located in the ui folder. After processing the content of the files, all files are transferred to the ui folder and the _ui_defs.json file is automatically added. Depending on the obfuscation settings, the names and number of files received may also change.

If you import the .json file:
> The obfuscator will process all the content in your file and output it in the format.json

How content will process in your files:
> First, the obfuscator will encrypt the syntax based on your key (read about this in another paragraph), then, depending on the settings, content cluttering is applied. A small message about the obfuscator itself is added to the end of the file, which I ask you not to remove.
## How your syntax will encrypt?
Syntax encryption is one of the most important parts of this obfuscator. Syntax encryption cannot be deobfuscated without your key, which makes it a very good protection. Syntax encryption can cause some errors, as it literally looks at whether this word or string is part of the syntax of the Json UI itself, or whether it is the name of some element.

What syntax encryption do:
> Syntax encryption looks at whether a word or string in your code is part of the Json-UI syntax, and if not, encrypts it using an MD5 hash or a Caesar cipher, depending on your settings.

**Attention!**
Syntax encryption is the most complex logic in this obfuscator, but it's not perfect. If you use any annotations or special Json-UI expressions, they may be encrypted incorrectly and cause errors, so you always need to add exceptions.

Example:
```
    "controls": [
      {
        "server_form_factory": {
          "type": "factory",
          "property_bag": {
            "long_form": "@server_form.square_dynamic",
            "custom_form": "@server_form.square_custom"
          }
        }
      }
    ]
```
Here you need to add server_form_factory to the exceptions, as it is a hardcored factory. More about exceptions you can read in another topic. Of course, a large database of exceptions has already been provided for syntax encryption, and you can view the list of exceptions in the source code in the data folder.

A brief description of the encryption logic for a better understanding:
> First, the names of the Json keys themselves are encrypted, and an array of syntax exceptions is used for them, which implies the complete identity of the entire key. Next, the key is divided into 2 parts, if it contains the @ character, and the annotation is processed (that is, the line after the @). The string after the @ is divided by a dot, this is done so that we can determine where the namespace and the Json key index are.
>
> Next, we process the Json key value itself, it is not encrypted in the standard, but it has some conditions for encryption. If a variable is found in the Json key value, it will be encrypted using separate exceptions, this is done because variables are Json keys that are encrypted according to the standard. The obfuscator takes into account that the value may contain annotations that also need to be encrypted. Annotations in the value are determined by finding a dot, but there may also be some obscure values with a dot in the value (such as pressed_button_name), so a whole ton of exceptions apply to them all lol.

I know you're tired of reading, but it's all very brief.
## Obfuscation settings
The obfuscator has several obfuscation settings, which you can find by clicking on the Settings button. We will analyze each of them separately. Don't forget to save your settings so that they don't revert to their original settings when you refresh the page.

Authorship message
> If you want to add an authorship message to the beginning of your code, you can specify it in this parameter. For line breaks, use \n. Message will be added to each file.

File content clogging
> It enabled file content clogging, which adds random comments to your content and removes spaces, making it difficult to read. You can disable this option to check syntax encryption for errors.

Light encryption mode
> If you have enabled these values, then syntax encryption logic will use the Caesar cipher rather than MD5 hashing. This allows you to reduce the weight of files, since the MD5 hash is quite long.

Enable debug mode (Console logs)
> This enables the output of logs about the obfuscation process to the browser console.

**Next settings is only for .zip processing**

Separate Json keys
> If you have enabled this option, your top Json keys will be distributed across different files, which will significantly interfere with deobfuscation. All annotations will work correctly, I have checked.

File name obfuscation
> If you enable this option, your file names will be encrypted with an MD5 hash. The resulting file names are taken into account when automatically creating _ui_defs.json

Obfuscated file names format
> If you have enabled File name obfuscation, the file format specified in this field will be added to the names of your files. The dot between name and file format is added automatically.

## Exceptions manager
Exceptions are a very important part of obfuscation, as the correctness of syntax encryption depends on them.

**Why do we need exceptions?**
First of all, if you use any annotations from, for example, standard minecraft elements (such as common.empty_panel), then you need to add these names and their variables to the exceptions, since syntax encryptor does not know whether these annotations are taken from other places. If we talk about annotations, then the obfuscator already has **built-in exceptions for all annotations of Minecraft** itself (that is, code from samples).

The exclusion panel pops up at the click of a button. There you can immediately see some of the inputs: the name of the exception, the type of exception, and the button to add.
Exception types are a very important aspect, it allows you to create exceptions more easily without making mistakes. Here we will talk about all types of exceptions individually.

**Global**

Exceptions of this type will be applied to the entire Json key if it completely matches the exception (the prefix |default will be ignored). Exceptions of this type are also used as variables, if, for example, you use the $key variable in any binding.
I'll give you a small example with the exception of $key.
```
"$key|default": "test",
"bindings": [
  {
    "source_property_name": "(((#title_text - $key) = #title_text))",
    "binding_type": "view",
    "target_property_name": "#visible"
  }
]
```
Here, the ```$key``` will not be encrypted, either in the Json key or in the binding expression. Because they completely match.

**Index**

Exceptions of this type will only apply to the part before the ```@``` character in Json keys. They are created for elements with a ```common.button``` annotation, where the state of the button is determined depending on the part before the ```@``` symbol. If you don't have an annotation, then you can safely use the Global type. Here is a small example with the exception of hover and default:
```
"controls": [
  {
    "default@annotation": {}
  },
  {
    "hover@annotation": {}
  },
  {
    "pressed@annotation": {}
  }
]
```
Here the words hover and pressed will not be encrypted, you can also add the same exception for default. But the annotations will be encrypted, unless of course you apply other exceptions to them.

**Annotation**

Exceptions of this type apply to all annotations. Annotations are the string after the @ character in a Json key, or the entire value of the Json key if it contains a dot that is not part of the binding expression. I'll give you a small example:
```
"$screen_content": "server_form.squareui_main_screen_content",
//...and
"square_default_form@cool_code.testtt": {}
```
Here, the annotations will be ```server_form.squareui_main_screen_content``` and ```cool_code.testtt```, which we can add as exceptions.

**Namespace**

Exceptions of this type will be applied to all namespace values. The namespace value is the value of the Json key ```namespace```, as well as the word before the dot in the annotation. The namespace value is encrypted by default, but according to the standard, namespace already have exceptions for hardcored Minecraft namespaces. Here is a small example:
```
"namespace": "my_namespace",
//...or
"test@my_namespace.test": {}
```
Here, the namespace values will be considered my_namespace, to which we can add an exception.

# Have any questions?
Post a new issue.
