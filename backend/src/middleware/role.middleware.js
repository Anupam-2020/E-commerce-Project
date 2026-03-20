function allowedRoles(...roles) {
    return (req, resp, next) => {
        if(!req.user || !roles.includes(req.user.role)) {
            return resp.status(403).json({
                message: 'Forbidden'
            })
        }
        next();
    };
}

module.exports = { allowedRoles };