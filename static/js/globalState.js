export const globalState = {
    filters: new Set(),
    columnName: "",
    observers: [],

    //===================== DONT NEED TO CHANGE THIS =======================
    // Method to subscribe observers that will be notified of changes
    subscribe : function(observerFunction) {
        this.observers.push(observerFunction);
    },
    
    // Method to unsubscribe observers
    unsubscribe: function(observerFunction) {
        this.observers = this.observers.filter(observer => observer !== observerFunction);
    },
    
    // Notify all observers about the change
    notifyObservers: function() {
        this.observers.forEach(observer => observer(this.columnName, this.filters));
    },
    
    // =====================================================================
    
    //===================== INSERT THE ADD FUNCTIONS OF NEW FILTERS HERE =======================
    // Add a song to the state and notify observers
    setFilters: function(name, fiterList) {
        this.filters.add(fiterList);
        this.columnName = name
        this.notifyObservers();
    },

};
