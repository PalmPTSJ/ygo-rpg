class CardBuilder {
    constructor(title,InputBuilder) {
        this.card = document.createElement("div"); this.card.className = "card";
        this.cardContent = document.createElement("div"); this.cardContent.className = "card-block";
        this.cardTitle = document.createElement("h4"); this.cardTitle.className = "card-title";
        
        this.card.style.marginBottom = "10px";
        
        this.cardTitle.innerHTML = title;
        
        this.card.appendChild(this.cardContent);
        this.cardContent.appendChild(this.cardTitle);
        
        this.targetComponent = null;
        
        this.inputList = [];
    }
    
    getCard() {
        return this.card;
    }
    
    addButton(buttonText,buttonAction) { // NEED FIX
        var btn = document.createElement("a");
        btn.className = "waves-effect waves-light btn";
        btn.innerHTML = buttonText;
        btn.onclick = ()=>buttonAction.call(this.targetComponent);
        this.cardContent.appendChild(btn);
    }
    
    autoEvent(getset) {
        return {
            onUpdate : (inputData)=>{inputData.set(getset.get())},
            onInput :  (inputData)=>{getset.set(inputData.get())}
        }
    }
    
    /*
    onEvent.onUpdate(targetInputField)
    onEvent.onInput(newInput)
    */
    
    addTextField(descText,onEvent) { // [descText] [______________]
        var div = document.createElement("div");
        div.className = "form-group row";
        
        var div2 = document.createElement("label");
        div2.className = "col-4 col-form-label";
        div2.innerHTML = descText;
        
        var divText = document.createElement("div");
        divText.className = "col-8";
        
        var textField = document.createElement("input");
        textField.setAttribute("type","text");
        textField.className = "form-control";
        
        divText.appendChild(textField);
        div.appendChild(div2);
        div.appendChild(divText);
        this.cardContent.appendChild(div);
        
        var inputData = {
            rootNode : div,
            inputNode : textField,

            onUpdate : ()=>{
                if(inputData.inputNode === document.activeElement) return;
                onEvent.onUpdate.call(this.targetComponent,inputData);
            },
            
            get : ()=>{ return textField.value},
            set : (val)=>{ textField.value = val}
        };
        
        $(textField).keypress(function(e){
            if(e.keyCode==13) {
                onEvent.onInput.call(this.targetComponent,inputData);
            }
        });
        
        this.inputList.push(inputData);
    }
    
    addArrayField(descText,onEvent) {
        var div = document.createElement("div");
        div.className = "card";
        
        var divInside = document.createElement("div");
        divInside.className = "card-block";
        divInside.innerHTML = "<h5 class=\"card-title\">"+descText+"</h5>";
        
        var div2 = document.createElement("label");
        div2.className = "col-4 col-form-label";
        div2.innerHTML = descText;
        
        var divText = document.createElement("div");
        divText.className = "col-8";
        
        var textField = document.createElement("input");
        textField.setAttribute("type","text");
        textField.className = "form-control";
        
       /* divText.appendChild(textField);
        div.appendChild(div2);
        div.appendChild(divText);*/
        div.appendChild(divInside);
        this.cardContent.appendChild(div);
        
        
        var inputData = {
            rootNode : divInside,
            inputNode : textField,
            textFieldList : [],
            
            onUpdate : (inputData)=>{
                for(var textField of inputData.textFieldList) {
                    if(textField === document.activeElement) return;
                }
                if(inputData.inputNode === document.activeElement) return;
                
                onEvent.onUpdate.call(this.targetComponent,inputData);
            },
            
            get : ()=>{
                var toRet = [];
                for(var textField of inputData.textFieldList) {
                    toRet.push(textField.value);
                }
                return toRet;
            },
            set : (val)=>{ 
                // update length
                if(inputData.textFieldList.length != val.length) {
                    while(inputData.textFieldList.length < val.length) {
                        // create new text field
                        var div = document.createElement("div");
                        div.className = "form-group row";
                        
                        var divL = document.createElement("label");
                        divL.className = "col-1 col-form-label";
                        divL.innerHTML = ""+inputData.textFieldList.length;
                        
                        var divText = document.createElement("div");
                        divText.className = "col-8";
                        
                        var divButton = document.createElement("div");
                        divButton.className = "col-3";
                        
                        var delButton = document.createElement("button");
                        delButton.setAttribute("type","button");
                        delButton.className = "btn btn-danger btn-block";
                        delButton.innerHTML = "X";
                        
                        var textField = document.createElement("input");
                        textField.setAttribute("type","text");
                        textField.className = "form-control";
                        
                        divText.appendChild(textField);
                        divButton.appendChild(delButton);
                        div.appendChild(divL);
                        div.appendChild(divText);
                        div.appendChild(divButton);
                        
                        inputData.rootNode.appendChild(div);
                        inputData.textFieldList.push(textField);
                        
                        $(textField).keypress(function(e){
                            if(e.keyCode==13) {
                                onEvent.onInput.call(this.targetComponent,inputData);
                            }
                        });
                    }
                    while(inputData.textFieldList.length > val.length) {
                        var rootDiv = inputData.textFieldList.pop().parentElement.parentElement;
                        rootDiv.parentElement.removeChild(rootDiv);
                    }
                }
                // fill data
                for(var i = 0;i < val.length;i++) {
                    inputData.textFieldList[i].value = val[i];
                }
            }
        };
        
        this.inputList.push(inputData);
    }
    
    onUpdate() {
        for(var input of this.inputList) {
            input.onUpdate(input);
        }
    }
    
    setTargetComponent(comp) {
        this.targetComponent = comp;
    }
}

class ObjectInspector {
    constructor(Builder) {
        this.inspectingObject = null;
        this.cardList = [];
        this.Builder = Builder;
    }
    
    inspect(obj) {
        this.inspectingObject = obj;
        this.cardList = [];
        if(obj == null) return;
        for(var comp of obj.components) {
            var builder = new this.Builder(comp.name);
            builder.setTargetComponent(comp);
            comp.buildInspector(builder);
            this.cardList.push(builder);
        }
    }
    
    applyHTML(rootNode) {
        for(var card of this.cardList) {
            rootNode.appendChild(card.getCard());
        }
    }
    
    update() {
        if(this.inspectingObject != null) {
            for(var card of this.cardList) {
                card.onUpdate();
            }
        }
    }
}