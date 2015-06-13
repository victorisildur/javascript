# javascript
Project 1: Simple Mvvm

Extremely simple mvvm frame , only has 100 lines!

Very straightforward mvvm completion, 

Combining angular's controller defination , Knockout's model defination

Design thoughts in Chinese: 

http://blog.csdn.net/vctisildur/article/details/46422347

Project 2: Avalon Like Mvvm

A greatly simplified avalon like mvvm, only 240 lines!

Hijacking vm's property's setter and getter method(accessor)

Accessor keep's its subscribers, who are registered by the scanTag() process

ScanTag() find bindings, aquire binding's evaluator, handler, and register bindings to model's property through registsMap

Design thoughts in Chinese:

http://blog.csdn.net/vctisildur/article/details/46454755