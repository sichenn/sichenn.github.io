function Parabola(site) {
    this.site = site;
    this.isLeaf = this.site != null;
    var leftParabola, rightParabola, parentParabola;
    var edge;
    
    this.setLeft = function(p) {
        this.leftParabola = p;
        p.parentParabola = this;
    }

    this.setRight = function(p) {
        this.rightParabola = p;
        p.parentParabola = this;
    }

}

Parabola.prototype.getLeftNeighbor = function(p) {
    return getLeftChild(getLeftParent(p));
}

Parabola.prototype.getRightNeighbor = function(p) {
    return getRIghtChild(getRightParent(p));
}

Parabola.prototype.getLeftParent = function(p) {
    let par = p.parentParabola;
    let pLast = p;
    while(par.leftParabola == pLast) {
        if(par.parent == null)
            return null;
        pLast = par;
        par = par.parent;
    }
    
    return par;
}

this.prototype.getRightParent = function(p) {
    let par = p.parent;
    let pLast = p;
    while(par.rightParabola == pLast) {
        if(par.parent == null)
            return null;
        pLast = par;
        par = par.parent;
    }
    return par;
}

this.prototype.getLeftChild = function(p) {
    if(p == null) 
        return null;
    let par = p.leftParabola;
    while(!par.isLeaf)
        par = par.rightParabola;
    return par;
}

this.prototype.getRIghtChild = function(p) {
    if(p == null)
        return null;
    let par = p.rightParabola;
    while(!par.isLeaf)
        par = par.leftParabola;
    return par;
}