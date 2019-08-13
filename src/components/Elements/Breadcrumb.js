import React from "react";

export const Breadcrumb = ( params ) => {
    return(
        <div className="page-title">
            <div className="row">
                <div className="col-sm-6">
                    <h6 className="mb-0">{params.title}</h6>
                </div>
                <div className="col-sm-6">
                    <nav className="float-left float-sm-right" aria-label="breadcrumb">
                        <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="#">{params.prev}</a>
                        </li>
                        <li className="active breadcrumb-item" aria-current="page">
                            {params.current}
                        </li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
    );
}