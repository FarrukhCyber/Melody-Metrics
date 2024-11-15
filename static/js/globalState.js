export const globalState = {
    filters: new Set(),
    columnName: "",
    platform: "playlist",
    wasReset: false,  // Property to track if a reset has occurred
    bpm: 150,
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
        console.log("GLOBAL STATE UPDATED")
        this.observers.forEach(observer => observer(this.columnName, Array.from(this.filters), this.wasReset, this.platform, this.bpm));
    },
    
    // =====================================================================
    
    //===================== INSERT THE ADD FUNCTIONS OF NEW FILTERS HERE =======================
    // Add a song to the state and notify observers
    setFilters: function(name, fiterList, platform='playlist', bpm=150) {
        // this.filters = fiterList;
        this.filters.add(fiterList);
        this.columnName = name
        this.platform = platform
        this.bpm = bpm
        this.notifyObservers();
    },

    reset() {
        console.log('RESET CALLED')
        this.filters.clear();
        this.columnName = '';
        this.wasReset = true;  // Indicate that a reset has occurred
        this.notifyObservers();
        this.wasReset = false;  // Reset the flag after notifying
    },

    getFilters: function(name) {
        return Array.from(this.filters).filter(filter => filter.includes(name));
    },

};
