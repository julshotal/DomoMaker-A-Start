const handleDomo = (e) => {
    e.preventDefault();

    $("#domoMessage").animate({width:'hide'},350);

    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoLvl").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), redirect, function() {
        loadDomosFromServer();
    });
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
            <label htmlFor="lvl">Level:</label>
            <input id="domoLvl" type="text" name="lvl" placeholder="Domo Level" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo"> No Domos yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {

        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {domo.name} </h3>
                <h3 className="domoAge"> Age: {domo.age}  Level: {domo.lvl}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const StrongestWindow = function(props) {

    //https://stackoverflow.com/questions/32076382/mongodb-how-to-get-max-value-from-collections
    const strongest = props.domos.find().sort({lvl:-1}).limit(1);
        
    return (
        <div>
            <h1>The strongest domo is....</h1>
            <div key={strongest._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName"> Name: {strongest.name} </h3>
                <h3 className="domoAge"> Age: {strongest.age}  Level: {strongest.lvl}</h3>
            </div>
        </div>
    );
}

const findStrongest = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <StrongestWindow domos={data.domos} />, document.querySelector("#domos")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
    );

    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector("#domos")
    );

    const nextPage = document.querySelector("#strongPG");
    
    nextPage.addEventListener("click", (e) => {
        e.preventDefault();
        findStrongest();
        return false;
    });

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
