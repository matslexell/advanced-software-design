# The Embedded Design Principle: Readings

## Dark Knowledge and Graph Grammars.
<Your answer goes here>


## My favorite principle for code quality.
<Your answer goes here>


# Design Exercise: Todo List.
This should be submitted as a github gist.
See Disco for more info.


# Django Email.

## 1.

My guess is that these three lines are the same 

```python
        #Console based:
				msg_data = message.message().as_bytes()
    		...
        self.stream.write("%s\n" % msg_data)
        self.stream.write("-" * 79)
        self.stream.write("\n")
        
				# Filebased:
				self.stream.write(message.message().as_bytes() + b"\n")
        self.stream.write(b"-" * 79)
        self.stream.write(b"\n")
```



If anything changes in the way this should be written it needs to be changed in both these places.

I would probably write a method called fromatMessageConsole and formatMessageFilebased, and then send those on to a single write message function. 



## 2.a.
The fail silently feature is where there's two different options to represent a failure: Either in the data returned or an error thrown. The essance could be described the following way:

```typescript
function excecuteFunctionFailSilently<Type>(f: () => Type, failSilently=true) {
  let success = false;
  let returnData: Type | undefined;
  try {
    returnData = f();
    success = true;
  } catch (error) {
    if (!failSilently) {
      throw error;
    }
  }
  return { success, returnData };
}

```



## 2.b.
In the django mail example a failure is represented either by an error thrown or that the size of outgoing messages is larger than the ones sent. For example in `smtp.py`:

```python
    def send_messages(self, email_messages):
        ...
        return num_sent
```



If the fail silently was sent to true, and a mail failed to send, this could be seen by: 

```python
len(list(email_messages)) > num_sent
```



Concerning the design desicion: I'm thinking that this design is quite limited in error handling. Either the app fails very loudly or it doesn't deal with any error. If there was a more general way of handling errors, such as storing then in some data structure the overall policy could be refactored easier at a later stage. For example, you might also want configure logging and retries. 



## 2.c.
```
with open("x.txt") as f:
    data = f.read()
    do something with data
```



## 3.a.
<Your answer goes here>

## 3.b.
<Your answer goes here>

## 3.c.
<Your answer goes here>


## 4.a.
<Your answer goes here>

## 4.b.
<Your answer goes here>

## 4.c.i.
<Your answer goes here>

## 4.c.ii.
<Your answer goes here>

## 4.c.iii.
<Your answer goes here>

## 4.d.
<Your answer goes here>

## 4.e.
<Your answer goes here>

## 4.f.
<Your answer goes here>


## 5.
<Your answer goes here>


## 6.
<Your answer goes here>


## Follow-up question.
<Your answer goes here>