/*
 * MediaFilter.java
 *
 * Version: $Revision: 3733 $
 *
 * Date: $Date: 2009-04-24 06:52:11 +0300 (vie 24 de abr de 2009) $
 *
 * Copyright (c) 2002-2009, The DSpace Foundation.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * - Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * - Neither the name of the DSpace Foundation nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDERS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS
 * OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 * USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE.
 */
package org.dspace.app.mediafilter;

import org.dspace.content.Bitstream;
import org.dspace.content.Item;
import org.dspace.core.Context;


/**
 * Abstract class which defines the default settings for a *simple* Media or Format Filter. 
 * This class may be extended by any class which wishes to define a simple filter to be run 
 * by the MediaFilterManager.  More complex filters should likely implement the FormatFilter
 * interface directly, so that they can define their own pre/postProcessing methods.
 */
public abstract class MediaFilter implements FormatFilter
{
	/**
     * Perform any pre-processing of the source bitstream *before* the actual 
     * filtering takes place in MediaFilterManager.processBitstream().
     * <p>
     * Return true if pre-processing is successful (or no pre-processing
     * is necessary).  Return false if bitstream should be skipped
     * for any reason.
     * 
     * 
     * @param c
     *            context
     * @param item
     *            item containing bitstream to process
     * @param source
     *            source bitstream to be processed
     * 
     * @return true if bitstream processing should continue, 
     *          false if this bitstream should be skipped
     */
    public boolean preProcessBitstream(Context c, Item item, Bitstream source)
            throws Exception
    {
        return true;  //default to no pre-processing
    }
     
    /**
     * Perform any post-processing of the generated bitstream *after* this
     * filter has already been run.
     * <p>
     * Return true if pre-processing is successful (or no pre-processing
     * is necessary).  Return false if bitstream should be skipped
     * for some reason.
     * 
     * 
     * @param c
     *            context
     * @param item
     *            item containing bitstream to process
     * @param generatedBitstream
     *            the bitstream which was generated by
     *            this filter.
     */
    public void postProcessBitstream(Context c, Item item, Bitstream generatedBitstream)
            throws Exception
    {
        //default to no post-processing necessary
    }
}
