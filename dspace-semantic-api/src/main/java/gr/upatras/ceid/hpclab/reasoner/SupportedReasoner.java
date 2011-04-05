/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

package gr.upatras.ceid.hpclab.reasoner;

public enum SupportedReasoner
{
    FACTPLUSPLUS("gr.upatras.ceid.hpclab.reasoner.OWLReasonerFactoryFactPlusPlusImpl"), 
    PELLET("gr.upatras.ceid.hpclab.reasoner.OWLReasonerPelletImpl");

    private String classImpl;

    SupportedReasoner(String value)
    {
        classImpl = value;
    }

    public String toString()
    {
        return classImpl;
    }
}
